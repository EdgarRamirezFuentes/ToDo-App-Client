/**
 * Load component
 */

import Spinner from 'react-bootstrap/Spinner';

const Load = () => {
    return (
        <>
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </>
    )
};

export default Load;