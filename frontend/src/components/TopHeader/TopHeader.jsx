import { useNavigate } from "react-router";
import "./TopHeader.css";

function TopHeader() {

    const redirect = useNavigate();
    const handleLogoClicked = () => {
        redirect("/");
    }

    return (
        <div className="top-header">
            <h2 style={{marginLeft: "0.5em"}}
                onClick={handleLogoClicked}
              >QuikBin</h2>
        </div>
    );
}

export default TopHeader;