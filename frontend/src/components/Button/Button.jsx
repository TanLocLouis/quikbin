import "./Button.css";

const Button = ({width = "100%",
                height = "50px",
                margin = "0",
                title = "Button",
                color = "black",
                backgroundColor="white",
                ...props}) => {
    return (
        <button style={{width,
                        height,
                        margin,
                        color,
                        backgroundColor,
                        }}
                {...props}
        >
                {title}
        </button>
    )
}

export default Button;