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
            <Button 
                    width="100px" 
                    title="Previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
            </Button>
            {!isEditing && (
                <span className="pagination-info" onClick={handleEditPageNumber}>Page {currentPage} of {totalPages}</span>
            )}
            {isEditing && (
                <div>
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
                    <button onClick={() => {
                        const page = parseInt(document.querySelector('input').value);
                        handlePageChange(page);
                        setIsEditing(false);
                    }}>Confirm</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
            <Button 
                width="100px" 
                title="Next"
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}>
            </Button>
        </div>
    )
}

export default Pagination;