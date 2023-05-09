import EtherPopup from './EtherPopup';
import Github from './GitHub';
import Disclaimer from './Disclaimer';
import CashAppPopup from './CashAppPopup';

export default function Footer() {

    return (
        <footer>
            <Disclaimer />
            
                <div className="footLinks">
                
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