class FirstTest {
    // directions = "";
    article_lines = [
        "On Tuesday, an explosion in Beirut, Lebanon, killed at least 137 people and injured about 5,000 others.",
        "The disaster was preceded by a large fire at the port's warehouse 12, on the city's northern Mediterranean coast.",
        "Shortly after 18:00 (15:00 GMT), the roof of the warehouse caught alight and there was a large initial explosion, followed by a series of smaller blasts that some witnesses said sounded like fireworks going off.",
        "About 30 seconds later, there was a colossal explosion that sent a mushroom cloud into the air and a supersonic blastwave radiating through the city.",
        "That blastwave levelled buildings near the port and caused extensive damage over much of the rest of the capital, which is home to two million people.",
        "Hospitals were quickly overwhelmed.",
        "Rescue workers have been digging through the rubble looking for survivors of the devastating blast."];

    article = "On Tuesday, an explosion in Beirut, Lebanon, killed at least 137 people and injured about 5,000 others. The disaster was preceded by a large fire at the port's warehouse 12, on the city's northern Mediterranean coast. Shortly after 18:00 (15:00 GMT), the roof of the warehouse caught alight and there was a large initial explosion, followed by a series of smaller blasts that some witnesses said sounded like fireworks going off. About 30 seconds later, there was a colossal explosion that sent a mushroom cloud into the air and a supersonic blastwave radiating through the city. That blastwave levelled buildings near the port and caused extensive damage over much of the rest of the capital, which is home to two million people. Hospitals were quickly overwhelmed. Rescue workers have been digging through the rubble looking for survivors of the devastating blast. ";
    nbTestLines = 8;
    summaries = [{
            summaryLines: ["An explosion in Beirut saved 137 people and injured about 5,000 others.", "President Trump expressed his solidarity with Lebanon."],
            answers: [new Set(['f1']), new Set(['f4'])],
            feedback: [{
                f1:'Correct',
                f2:'Error: The "explosion" and "137 people" are related by "saving". There is no mention of this relation in the text. Wrong entities in the relation requires that the relation is mentioned in the text.',
                f3:'Error: The only circumstance specification in this sentence is "Beirut" (location) and it is correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }, {
                f1:'Error: This cannot be verified when both relation and entities are not found in the text.',
                f2:'Error: This cannot be verified when both relation and entities are not found in the text.',
                f3:'Error: This cannot be verified when both relation, entities, and circumstance specifications are not found in the text.',
                f4:'Correct',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: This cannot be verified when both relation, entities, and circumstance specifications are not found in the text.',
                f7:'Error: This cannot be verified when both relation, entities, and circumstance specifications are not found in the text.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        },
        {
            summaryLines: ["An explosion in Beirut killed rescue workers.", "Rescue workers have been digging through rubble looking for survivors."],
            answers: [new Set(['f2']), new Set()],
            feedback: [{
                f1:'Error: The relation "killed" is found in the text. So it is not a wrong relation.',
                f2:'Correct',
                f3:'Error: The only circumstance specification in this sentence is "Beirut" (location) and it is correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            },{
                f1:'Error: The relation "digging" and "looking" is found in the text. So it is not a wrong relation.',
                f2:'Error: All entities are correctly related to each other as found in the text.',
                f3:'Error: The only circumstance specification in this sentence is "through rubbles" (location) and it is correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        },{
            summaryLines: ["On Wednesday, an explosion in Beirut killed at least 137 people.", "They have been digging through rubble looking for survivors."],
            answers: [new Set(['f3']), new Set(['f6'])],
            feedback: [{
                f1:'Error: The relation "killed" is found in the text. So it is not a wrong relation.',
                f2:'Error: The entities are correctly related to each other according to the text.',
                f3:'Correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            },{
                f1:'Error: The relation "digging" and "looking" is found in the text. So it is not a wrong relation.',
                f2:'Error: The only explicit entity "survivors" is correct in the relation "looking for". The pronoun is referencing an ambiguous entity though.',
                f3:'Error: The only circumstance specification in this sentence is "through rubbles" (location) and it is correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Correct.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        },{
            summaryLines: ["An explosion looking survivors of the blast."],
            answers: [new Set(['f5'])],
            feedback : [{
                f1:'Error: When the sentence is meaningless the other categories should not be selected.',
                f2:'Error: When the sentence is meaningless the other categories should not be selected.',
                f3:'Error: When the sentence is meaningless the other categories should not be selected.',
                f4:'Error: When the sentence is meaningless the other categories should not be selected.',
                f5:'Correct.',
                f6:'Error: When the sentence is meaningless the other categories should not be selected.',
                f7:'Error: When the sentence is meaningless the other categories should not be selected.',
                f8:'Error: When the sentence is meaningless the other categories should not be selected.'
            }]
        }, {
            summaryLines: ["A warehouse exploded because rescue workers have been digging through rubble looking for survivors."],
            answers:[new Set(['f7'])],
            feedback:[{
                f1:'Error: The two separate facts are correct.',
                f2:'Error: The two separate facts are correct.',
                f3:'Error: The only circumstance specification in this sentence is "through rubbles" (location) and it is correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Correct.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        }
    ];
}

class SecondTest {
    // directions=
    article_lines = [
    "Safwan Choudhry says WestJet wanted his 19-month-old to wear a mask, but the baby girl would not stop crying.",
    "The airline says the issue was with Mr Choudhry's three-year-old.",
    "Tuesday morning's Flight 652 from Calgary to Toronto was stopped, and all passengers were ordered to disembark.",
    "Mr Choudhry told the BBC his oldest daughter, who is three, was eating a snack before take-off when flight attendants approached them asking that both their children wear a mask.",
    "He said he and his wife were masked.",
    "He said he asked if his daughter could finish her snack, but that they said they had a \"zero tolerance policy\" and would not close the plane door without her wearing a mask.",
    "Mr Choudhry said he agreed to put one on immediately.",
    "He says the three-year-old did put on a mask, after some fussing.",
    "Mr Choudhry says she was so upset she vomited.",
    "He says WestJet was aggressive, and told them that because his youngest daughter was not wearing a mask, and was too upset to wear a mask, the whole family would have to leave.",
    "He says they told them that if they did not leave, they could be arrested, charged and receive prison time.",
    "Mr Choudhry says he and his wife were respectful. They ultimately agreed to leave."];

    article = "Safwan Choudhry says WestJet wanted his 19-month-old to wear a mask, but the baby girl would not stop crying. The airline says the issue was not with the infant, who is below the age required to wear a mask, but with Mr Choudhry's three-year-old. Tuesday morning's Flight 652 from Calgary to Toronto was stopped, and all passengers were ordered to disembark. Mr Choudhry told the BBC his oldest daughter, who is three, was eating a snack before take-off when flight attendants approached them asking that both their children wear a mask. He said he and his wife were masked. He said he asked if his daughter could finish her snack, but that they said they had a \"zero tolerance policy\" and would not close the plane door without her wearing a mask. Mr Choudhry said he agreed to put one on immediately. He says the three-year-old did put on a mask, after some fussing. Mr Choudhry says she was so upset she vomited. He says WestJet was aggressive, and told them that because his youngest daughter was not wearing a mask, and was too upset to wear a mask, the whole family would have to leave. He says they told them that if they did not leave, they could be arrested, charged and receive prison time. Mr Choudhry says he and his wife were respectful. They ultimately agreed to leave.";

    nbTestLines = 8;

    summaries = [{
            summaryLines: ["Mr Choudhry and his family ultimately refused to leave."],
            answers: [new Set(['f1'])],
            feedback: [{
                f1:'Correct',
                f2:'Error: The main event here is "refused to leave". There is no mention of this event in the text. Wrong entities in the relation requires that the relation is mentioned in the text.',
                f3:'Error: There is no wrong circumstance specification here.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        }, {
            summaryLines: ["Mr Choudhry says WestJet wanted his 19-month-old to wear a mask, but the baby girl would not stop crying.", "WestJet says the issue was with the infant."],
            answers: [new Set([]), new Set(['f2'])],
            feedback: [{
                f1:'Error: The relations mentioned are found in the text. So it is not a wrong relation.',
                f2:'Error: All entities are correctly related to each other as found in the text.',
                f3:'Error: There is no wrong specification of circumstance.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }, {
                f1:'Error: The relations "issues was with" is found in the text. So it is not a wrong relation.',
                f2:'Correct',
                f3:'Error: There is no wrong circumstance specification here.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        }, {
            summaryLines: ["Mr Choudhry said the three-year-old did put on a mask right away."],
            answers: [new Set(['f3'])],
            feedback: [{
                f1:'Error: The relations "said" and "did put on" are found in the text. So it is not a wrong relation.',
                f2:'Error: The entities are correctly related to each other according to the text.',
                f3:'Correct.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        }, {
            summaryLines: ["WestJet announced they would reimburse tickets of Mr Choudhry's family and apologized for the incident.", "Issue that last he arranged coming back."],
            answers: [new Set(['f4']), new Set(['f5'])],
            feedback : [{
                f1:'Error: This cannot be verified when both relation and entities are not found in the text.',
                f2:'Error: This cannot be verified when both relation and entities are not found in the text.',
                f3:'Error: This cannot be verified when both relation, entities, and circumstance specifications are not found in the text.',
                f4:'Correct',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: This cannot be verified when both relation, entities, and circumstance specifications are not found in the text.',
                f7:'Error: This cannot be verified when both relation, entities, and circumstance specifications are not found in the text.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            },{
                f1:'Error: When the sentence is meaningless the other categories should not be selected.',
                f2:'Error: When the sentence is meaningless the other categories should not be selected.',
                f3:'Error: When the sentence is meaningless the other categories should not be selected.',
                f4:'Error: When the sentence is meaningless the other categories should not be selected.',
                f5:'Correct.',
                f6:'Error: When the sentence is meaningless the other categories should not be selected.',
                f7:'Error: When the sentence is meaningless the other categories should not be selected.',
                f8:'Error: When the sentence is meaningless the other categories should not be selected.'
            }]
        }, {
            summaryLines: ["Mr Chaundry's daughter did not want to wear a mask because she had vomited.", "They have a zero-tolerance policy."],
            answers: [new Set(['f7']), new Set(['f6'])],
            feedback:[{
                f1:'Error: The two separate facts are correct.',
                f2:'Error: The two separate facts are correct.',
                f3:'Error: There is no circumstance specification.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Error: There are no pronouns or referring expressions.',
                f7:'Correct.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }, {
                f1:'Error: The relations are found in the text. So it is not a wrong relation.',
                f2:'Error: The only explicit entity "policy" is correct in the relation "they said they had". The pronoun is referencing an ambiguous entity though.',
                f3:'Error: There is no wrong circumstance specification.',
                f4:'Error: For a fact to contain information not in article, it needs to have a relation or an entity at least that are not found in the text. In this case all entities are found in the text.',
                f5:'Error: The sentence is grammatically correct.',
                f6:'Correct.',
                f7:'Error: The error is not in how the facts are related but in one of the facts itself.',
                f8:'Error: The mistake can generally be found in the above categories. It is the case here.'
            }]
        }];
}

export { FirstTest, SecondTest };