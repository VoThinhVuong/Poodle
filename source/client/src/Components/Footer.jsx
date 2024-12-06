import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email'; // Correct import for Email icon

import "../styles/Footer.css";

function Footer() {
  return (
    <div className='Footer'>
      <div className='Socials'>
        <FacebookIcon />
        <LinkedInIcon />
        <EmailIcon />
      </div>
      <div className='Copyright'>&copy; 2024 Cooked Inc.</div>
    </div>
  );
}

export default Footer;
