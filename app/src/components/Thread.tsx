import * as React from 'react'
import {Button, Icon, Label} from 'semantic-ui-react'
import {like} from "../store/threads/actions";

interface ThreadProps {
    timestamp: Date,
    author: string,
    text: string,
    likedBy: string[]
}

const Thread: React.FC<ThreadProps> = ({ author, text, timestamp, likedBy }) => (
    <div>
        <div >
            <div>
                <h3>{text}</h3>
                <Button as='div' labelPosition='right'>
                    <Button icon>
                        <Icon name='heart' />
                         Like
                    </Button>
                    <Label as='a' basic pointing='left'>
                        { likedBy.length }
                    </Label>
                </Button>
            </div>
        </div>
    </div>
)

export default Thread