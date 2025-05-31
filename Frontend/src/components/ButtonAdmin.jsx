import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
const ButtonAdmin = ({router, text, img}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
            <button 
            className="btn" onClick={() => navigate(`/${router}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} 
            style={
                { backgroundColor: "#00C9A7",
                 color: "#1A202C", 
                 fontSize: '1.1rem', 
                 transition: 'all 0.2s ease-out',
                 fontWeight: 'bold',
                 transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                 cursor: 'pointer' }
                 }>
                    {img && <img src={img} alt={text} style={{ marginLeft: '8px', maxWidth: '140px' }} />}
                    {text}
                </button>
        </>
    )
}

export default ButtonAdmin;