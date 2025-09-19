export const environment = {
    // Live:
    // api: "https://backend.qubic3d.co.za/"
    // Local (via Angular proxy): base host; code appends 'api/...'
    api: "/"
};

export const environmentApplication = {
    // Live:
    // api: "https://backend.qubic3d.co.za/api/"
    // Local (via Angular proxy): keep explicit '/api/' for services using environmentApplication
    api: "/api/"
};
