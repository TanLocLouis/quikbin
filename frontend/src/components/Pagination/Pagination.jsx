import { useState } from "react";
import Button from "../Button/Button.jsx";
import "./Pagination.css";
import { useToast } from "../../contexts/ToastContext.jsx";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const { addToast } = useToast();

    // Caculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Callback function when page changes
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        } else {
            addToast("error", "Invalid page number");
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const handleEditPageNumber = () => {
        setIsEditing(true);
    }

    return (
        <div className="pagination">
            {!isEditing && (
                <div>
                    <Button 
                            width="100px" 
                            title="Previous"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}>
                    </Button>
                    <span style={{ margin: "0 1em" }} className="pagination-info" onClick={handleEditPageNumber}>Page {currentPage} of {totalPages}</span>
                    <Button 
                        width="100px" 
                        title="Next"
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}>
                    </Button>
                </div>
            )}
            {isEditing && (
                <div className="pagination-edit">
                    <input 
                        type="number"
                        placeholder="Jump to page..."
                        style={{ width: "10em" }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const page = parseInt(e.target.value);
                                handlePageChange(page);
                                setIsEditing(false);
                            }
                        }}
                        type="number"
                    />
                    <button
                        style={{ width: "75px" }}
                        onClick={() => {
                        const page = parseInt(document.querySelector('input').value);
                        handlePageChange(page);
                        setIsEditing(false);
                    }}>Ok</button>
                    <button 
                        style={{ width: "90px" }}
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

export default Pagination;