# Adapted from https://github.com/akuznets0v/mturk-lean-external-question

#%%
import config
import boto3
import json
import os
import xmltodict
import datetime
from json import JSONEncoder
from collections import Counter, defaultdict
from dateutil.tz import tzlocal
import datetime
import itertools
import numpy as np
import matplotlib.pyplot as plt


#%%
# ============================VARIABLES ============================
# START AWS CONFIGURATION VARS
AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY
# END MAIN CONFIGURATION VARS

# START IMPORTANT HIT VARIABLES
sandbox = False
testOnly = "mainTaskOnly"  # Skip to main task "mainTaskOnly", or "testOnly"
entityTest = "" #"continue"  #""  # Blacklist users as soon as they make a mistake on entity test or let them continue
base_url = "your_base_url"
assignments_per_hit = 3
acceptable_error_percent = 80 # 100 all correct, 80 one errors at most.
if sandbox:
    qualificationTypeId = 'ID of qualification in sandbox' # sandbox
else:
    qualificationTypeId = 'ID of qualification in deployment' # deployment



## CNN DM
cnndm_params = {
    'payment_per_assignment': 0,
    'bonus': 0,
    'bonusMomentum': 0,
    'current_batch': 'selected_files_cnndm.txt',
    'completed_hits': 'files with completed hits counter',
    'min_time': 3,
    'traps_mode': 'modelEnd',
}
cnndm_params['hit_description'] = f'Find mistakes in summaries of news articles and categorize them (20-30 min). BONUSES for good work: {cnndm_params["bonus"]}$/HIT, {cnndm_params["bonusMomentum"]}$/10 HITS. FIXED ISSUES.'

## BBC
bbc_params = {
    'payment_per_assignment': 0,
    'bonus': 0,
    'bonusMomentum': 0,
    'current_batch': 'selected_files_bbc.txt',
    'completed_hits': 'files with completed hits counter',
    'min_time': 1,
    'traps_mode': 'sequence',
}
bbc_params['hit_description'] = f'Find mistakes in summaries of news articles and categorize them (10-15 min). BONUSES for good work: {bbc_params["bonus"]}$/HIT, {bbc_params["bonusMomentum"]}$/10 HITS. FIXED ISSUES.'

# CHOOSE DATA
# data_params = cnndm_params
data_params = bbc_params

with open(data_params['current_batch']) as infile:
    hashes = [line.strip().split('.')[0] for line in infile.readlines()]

with open(data_params['completed_hits']) as infile:
    completed_hits = {line.strip().split(',')[1]:int(line.strip().split(',')[2]) for line in infile.readlines()}    

params_to_encode = []
for h in hashes:
    if h in completed_hits:
        assignments_completed = completed_hits[h]
        max_assignments = max(0, assignments_per_hit - assignments_completed)
    else:
        max_assignments = assignments_per_hit
    params_to_encode.append({
        'hash':h,
        'testOnly':testOnly,
        'entityTest':entityTest,
        'bonus':data_params['bonus'],
        'bonusMomentum':data_params['bonusMomentum'],
        'trapsMode': data_params['traps_mode'],
        'trapsNum': 4,
        'minTrap': 0.7,
        'minTime': data_params['min_time'],
        'maxHitsNum': 10000,
        'maxAssignments': max_assignments
        })

print(params_to_encode[:4])
if sandbox:
    # params_to_encode = params_to_encode[-1:]
    pass

# END IMPORTANT HIT VARIABLES

countries = ['US', 'CA', 'GB', 'AU', 'NZ']
qualifications = [{
        'QualificationTypeId': '00000000000000000071', # Worker_Locale
        'Comparator': 'In',
        'LocaleValues': [{'Country': country} for country in countries]
    }, {
        'QualificationTypeId': '000000000000000000L0', # Worker_​PercentAssignmentsApproved
        'Comparator': 'GreaterThanOrEqualTo',
        'IntegerValues':[95]
    }, {'QualificationTypeId':qualificationTypeId,
                        'Comparator': 'GreaterThanOrEqualTo',
                        'IntegerValues':[acceptable_error_percent]} 
]
# END QUALIFICATION CONFIGURATION

# START DECORATIVE HIT VARIABLES
hit_title = "Find mistakes in summaries of news articles."
hit_keywords = "news, read, categorize, mistakes, facts, AI models, summaries, bonus"
duration_in_seconds = 60 * 60
lifetime_in_seconds = 4 * 24 * 60 * 60
autopay_in_seconds = 4 * 24 * (60 * 60)
frame_height = 800
# END DECORATIVE HIT VARIABLES
# =================================================================

#%%
class ExternalQuestion:
    """
    An object for constructing an External Question.
    """
    schema_url = "http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd"
    template = '<?xml version="1.0" encoding="UTF-8"?><ExternalQuestion xmlns="%(schema_url)s"><ExternalURL>%%(external_url)s</ExternalURL><FrameHeight>%%(frame_height)s</FrameHeight></ExternalQuestion>' % vars()

    def __init__(self, external_url, frame_height):
        self.external_url = external_url
        self.frame_height = frame_height

    def get_as_params(self, label='ExternalQuestion'):
        return {label: self.get_as_xml()}

    def get_as_xml(self):
        return self.template % vars(self)

# ============================HELPER METHODS=======================
# Quick method to encode url parameters
def encode_get_parameters(baseurl, arg_dict):
    queryString = baseurl + "?"
    for indx, key in enumerate(arg_dict):
        queryString += str(key) + "=" + str(arg_dict[key])
        if indx < len(arg_dict)-1:
            queryString += "&amp;"
    return queryString

# Initialize boto connection based on sandbox.
region_name = 'us-east-1'
if sandbox:
    AMAZON_HOST = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
else:
    AMAZON_HOST = 'https://mturk-requester.us-east-1.amazonaws.com'

client = boto3.client(
    'mturk',
    endpoint_url=AMAZON_HOST,
    region_name=region_name,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)
# Selecting which endpoint to pass as parameter
if sandbox:
    external_submit_endpoint = "https://workersandbox.mturk.com/mturk/externalSubmit"
else:
    external_submit_endpoint = "https://www.mturk.com/mturk/externalSubmit"

def create_mturk_hit(params, qual_id=None):
    encoded_url = encode_get_parameters(base_url, params)
    create_hit_result = client.create_hit(
        MaxAssignments=params['maxAssignments'],
        AutoApprovalDelayInSeconds=autopay_in_seconds,
        LifetimeInSeconds=lifetime_in_seconds,
        AssignmentDurationInSeconds=duration_in_seconds,
        Reward=str(data_params['payment_per_assignment']),
        Title=hit_title,
        Keywords=hit_keywords,
        Description=data_params['hit_description'],
        Question=ExternalQuestion(encoded_url, frame_height).get_as_xml(),
        QualificationRequirements=qualifications)
    print(create_hit_result)
    return create_hit_result

#%%
# This will return $10,000.00 in the MTurk Developer Sandbox
print(client.get_account_balance()['AvailableBalance'])

#%%
# Create Qualification (To be done only once)
# questions = open('qualification_questions.xml', mode='r').read()
# answers = open('qualification_answers.xml', mode='r').read()

# qual_response = client.create_qualification_type(
#                         Name='Identify mistakes in summaries.',
#                         Keywords='test, qualification, news, facts, mistakes, semantics, grammar',
#                         Description='This test checks if you can identify mistakes in summaries. HIT will pay +10$/h.',
#                         QualificationTypeStatus='Active',
#                         Test=questions,
#                         AnswerKey=answers,
#                         TestDurationInSeconds= 60 * 60)

# print(qual_response['QualificationType']['QualificationTypeId'])

# %%
# DANGER POST HITS
hits = []
s = 0
for params in params_to_encode:
    if params['maxAssignments'] > 0:
        params['host'] = external_submit_endpoint
        response = create_mturk_hit(params, qualificationTypeId)
        hits.append(response)
        print(params)
        s += params['maxAssignments']
print(f'Total assignments created: {s}')    
# https://workersandbox.mturk.com/mturk/preview?groupId=3AG2YDBQJYHULLFESL6FGE75NS5XHB
# https://worker.mturk.com/mturk/preview?groupId=3R7DCNC1OUV8FYHYPMQESYOXZ6AUDX
#%%
hit_file = 'hit_file.json'

#%%
if sandbox != True:
    with open(os.path.join('hit-results', hit_file), 'w') as outfile:
        outfile.write(json.dumps(hits, indent=4, sort_keys=True, default=str))

#%%
################################################################
# Get the hit results
################################################################

def hit_xml_to_dict(xml):
    parsed_dict = xmltodict.parse(xml)
    parsed_dict["QuestionFormAnswers"]["Answer"] = {elt["QuestionIdentifier"]:elt["FreeText"] for elt in parsed_dict["QuestionFormAnswers"]["Answer"]}
    return parsed_dict

def to_json(d, answer_fields):
    for field in answer_fields:
        if field in d["QuestionFormAnswers"]["Answer"] and d["QuestionFormAnswers"]["Answer"][field] != 'undefined':
            d["QuestionFormAnswers"]["Answer"][field] = json.loads(d["QuestionFormAnswers"]["Answer"][field])
    return d

def count_errors(mistakes):
    examples = Counter()
    for mistake in mistakes:
        if not mistake["result"]:
            category = mistake["correctCategory"][0] if mistake["correctCategory"] != [] else "f0"
            examples[category] += 1
    return examples

def extract_results(client, hit_ids, bonus, bonusMomentum, pay_bonus=False):
    res_assignments = []
    pending = 0
    available = 0
    total = 0
    rejected = 0
    approved = 0
    normal_bonus = 0
    bonus_momentum = 0
    count_good_hits_user = Counter()
    for hit_id in hit_ids:

        # Get the status of the HIT
        hit = client.get_hit(HITId=hit_id)
        pending += hit['HIT']["NumberOfAssignmentsPending"]
        available += hit['HIT']["NumberOfAssignmentsAvailable"]
        total += hit['HIT']['MaxAssignments']
        # print(hit)
        # Get a list of the Assignments that have been submitted
        assignmentsList = client.list_assignments_for_hit(
            HITId=hit_id,
            AssignmentStatuses=['Submitted', 'Approved', 'Rejected'],
            MaxResults=10
        )
        assignments = assignmentsList['Assignments']
        answers = []
        for assignment in assignments:

            # Retreive the attributes for each Assignment
            worker_id = assignment['WorkerId']
            assignment_id = assignment['AssignmentId']

            # Retrieve the value submitted by the Worker from the XML
            assignment["Answer"] = to_json(hit_xml_to_dict(assignment["Answer"]), ['resultData', 'secondTestLog'])
            answers = assignment["Answer"]["QuestionFormAnswers"]["Answer"]

            res_assignments.append(assignment)

            # Approve the Assignment (if it hasn't been already)
            if assignment['AssignmentStatus'] == 'Submitted' or assignment['AssignmentStatus'] == 'Approved':
                if (answers["passedEntityTest"] == 'true'):
                    if assignment['AssignmentStatus'] == 'Submitted':
                        if pay_bonus:
                            client.approve_assignment(
                                AssignmentId=assignment_id,
                                OverrideRejection=False
                            )
                    approved += 1
                    if (answers['resultData']['trapsResults'] > 0.6):
                        if pay_bonus:
                            client.send_bonus(
                                WorkerId=worker_id,
                                BonusAmount=str(bonus),
                                AssignmentId=assignment_id,
                                Reason='Completed good quality HIT on identifications of facts in summaries.',
                            )
                        normal_bonus += 1
                        count_good_hits_user[worker_id] += 1
                        if count_good_hits_user[worker_id] % 10 == 0 and count_good_hits_user[worker_id] != 0:
                            if pay_bonus:
                                client.send_bonus(
                                    WorkerId=worker_id,
                                    BonusAmount=str(bonusMomentum),
                                    AssignmentId=assignment_id,
                                    Reason='Completed 10 good quality HITs on identifications of facts in summaries.',
                                )
                            bonus_momentum += 1
                else:
                    if assignment['AssignmentStatus'] == 'Submitted':
                        if pay_bonus:
                            client.reject_assignment(
                                AssignmentId=assignment_id,
                                RequesterFeedback="You failed the entity test indicating you did not read the article.."
                            )
                    rejected += 1

    print("Assignments available: {}, pending: {}, total: {}".format(available, pending, total))
    print(f'Approved {approved}/{approved + rejected}, Rejected {rejected}/{approved + rejected}')
    print(f'NB bonus {normal_bonus}, NB momentum bonus {bonus_momentum}, Total bonus {normal_bonus*bonus+bonus_momentum*bonusMomentum}')

    return res_assignments
#%%

hit_files_cnndm = ['hit_file.json'] 
hit_files_bbc = ['hit_file.json']


results_file_cnndm = 'annotations_cnndm.json'
results_file_bbc = 'annotations_bbc.json'

pay_bonus=False

for hit_files, results_file, b, b_m in zip(
        [
            hit_files_cnndm,
            hit_files_bbc
        ],
        [
            results_file_cnndm,
            results_file_bbc
        ],
        [
            cnndm_params['bonus'],
            bbc_params['bonus']
        ],
        [
            cnndm_params['bonusMomentum'], 
            bbc_params['bonusMomentum']
        ]
    ):
    hit_ids = []
    for hit_file in hit_files:
        if hit_file == '':
            continue
        with open(os.path.join('hit-results', hit_file)) as infile:
            hits_loaded = json.loads(infile.read())
            hit_ids += [hit["HIT"]["HITId"] for hit in hits_loaded]
    annotations = extract_results(client, hit_ids, b, b_m, pay_bonus=pay_bonus)
    with open(os.path.join('hit-results', results_file), 'w') as outfile:
        outfile.write(json.dumps(annotations, indent=4, sort_keys=True, default=str))
