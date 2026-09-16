/*

200 OK
The request has succeeded.
201 Created
The request has succeeded and a resource has been created as a result.
204 No Content
The request has succeeded, but there is no content to send in the response (often used for delete operations).
400 Bad Request
The server could not understand the request due to invalid syntax or missing/incorrect parameters.
401 Unauthorized
Authentication is required and has failed or has not yet been provided.
403 Forbidden
The request is understood by the server, but it is refusing to fulfill it due to permissions issues.
404 Not Found
The requested resource could not be found on the server.
409 Conflict
The request could not be completed due to a conflict with the current state of the resource (e.g., duplicate entry).
422 Unprocessable Entity
The request was well-formed but unable to be followed due to semantic errors (commonly used for validation errors).
500 Internal Server Error
A generic error message when the server encounters an unexpected condition that prevented it from fulfilling the request.
503 Service Unavailable
The server is not ready to handle the request, often temporary due to maintenance or overload.

*/

enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

export default HttpStatusCode