import * as React from 'react'

interface HeaderProps {
    title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => (
    <div>
        <div >
            <div>
                <h2>{title}</h2>
            </div>
        </div>
    </div>
)

export default Header