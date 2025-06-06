const ModalMachine = ({ show, onClose, title, children }) => {
    if (!show) {
        return null;
    }

    const modalColors = {
        darkPrimary: '#1A202C',
        accent: '#00C9A7',
        textLight: '#F7FAFC',
        tableHeaderBg: '#2D3748',
        mediumNeutral: '#E2E8F0', 
        textDark: '#2D3748', 
    };

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '1rem', 
    };

    const contentStyle = {
        backgroundColor: modalColors.darkPrimary,
        color: modalColors.textLight,
        borderRadius: '0.75rem',
        width: '100%', 
        maxWidth: '500px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.5)', 
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
    };

    const headerStyle = {
        borderBottom: `1px solid ${modalColors.tableHeaderBg}`,
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };
    
    const titleStyle = {
        color: modalColors.accent,
        fontWeight: 'bold',
        fontSize: '1.25rem', 
        margin: 0,
    };
    
    const bodyStyle = {
        padding: '1.5rem',
        overflowY: 'auto', 
        flexGrow: 1,
    };

    const footerStyle = {
        borderTop: `1px solid ${modalColors.tableHeaderBg}`,
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h5 style={titleStyle}>{title}</h5>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        aria-label="Close" 
                        onClick={onClose}
                        style={{filter: 'invert(0.8)'}} 
                    ></button>
                </div>
                <div style={bodyStyle}>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default ModalMachine;
