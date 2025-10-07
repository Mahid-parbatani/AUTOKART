
const processPayment = async () => {
    console.log("Processing payment...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Payment processed successfully.");
}

// Function to simulate payment
const simulatePayment = async () => {
    try {
        console.log("Initiating payment...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Verifying payment details...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("Payment details verified.");

        await processPayment();
        return true;

    } catch (error) {
        console.error(`Payment failed: ${error}`);
        return false;
    }
}

module.exports = { simulatePayment }

