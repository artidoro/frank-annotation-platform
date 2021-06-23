import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class ArticleWebPageIFrame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iFrameHeight: '0px'
        }
    }

    render() {
        return (
            <iframe
                style={{maxWidth:640, width:'100%', height:this.state.iFrameHeight, overflow:'visible'}}
                onLoad={() => {
                    const obj = ReactDOM.findDOMNode(this);
                    this.setState({
                        "iFrameHeight":  obj.contentWindow.document.body.scrollHeight + 'px'
                    });
                }}
                title='article-web-page'
                ref="iframe"
                srcDoc={this.props.articleHtml}
                width="100%"
                height={this.state.iFrameHeight}
                scrolling="no"
                frameBorder="0"
            />
        );
    }
}

export default ArticleWebPageIFrame;