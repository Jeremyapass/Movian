/**
 * Empty middleware function to prevent project errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export default function middleware(req, res, next) {
    // This is an empty middleware function
    // Add your middleware logic here when needed
    if (next) {
        next();
    }
}

// Alternative export if needed
export const config = {
    matcher: ['/api/:path*']
};