/** codes.js define the HTTP codes used for various routes */
module.exports = {
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    NO_CONTENT: 204,
    CONFLICT: 409
};

// if in path, request.params.X
// if a querystring, request.query,X
// if in body, request.body.X
