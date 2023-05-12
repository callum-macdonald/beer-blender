import EtherPopup from './EtherPopup';
import Github from './GitHub';
import Disclaimer from './Disclaimer';
import CashAppPopup from './CashAppPopup';
import Link from '@mui/material/Link';
            
export default function Footer() {

    return (
        <footer>
            <Disclaimer />

            <div className="footLinks">

            <div style={{color: "#6666667d", fontSize: "0.65em" }}>
                Powered by {}
                <Link href="https://openai.com" target="_blank" color="primary" underline="none" >
                 OpenAI {}
                </Link>
                and {}
                <Link href="https://vercel.com" target="_blank" color="primary" underline="none" >
                 Vercel {}
                </Link>
            </div>

                <div className="leftLink">
                    <Github />
                </div>
                <div className="middleLink">
                    <CashAppPopup />
                </div>
                <div className="rightLink">
                    <EtherPopup />
                </div>



            </div>
            
        </footer>
    );
};