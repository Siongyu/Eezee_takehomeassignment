"use client"
import { Image } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'

export const Navbar:React.FC = () => {
	return (
		<header className="bodyContent" style={{marginBottom:"0.3%"}}>
      	<div style={{display: "flex"}}>
        <span>
					<Image 
						src="/singapore-flag-icon.svg" 
						width={20}
						height={15}
						alt="singapore"
						preview={false}
					/> Singapore
				</span>
				<span style={{marginLeft: "3%"}}><PhoneOutlined /> +65 6797 9688</span>
      </div>
		</header>
	)
}

export default Navbar