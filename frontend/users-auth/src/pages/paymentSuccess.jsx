const React = require('react');
const { useSearchParams } = require('react-router-dom');

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams(); // Corrected variable name
    const referenceNum = searchParams.get('reference'); // Get the reference number

    return (
        <div>
            <h1>
                {referenceNum ? `Reference No: ${referenceNum}` : 'Payment reference number not found'}
            </h1>
        </div>
    );
};

export default PaymentSuccess;
