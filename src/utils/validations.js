
function isValidCustomer(res, name) {
    if (!name) {
        return true;
    }
    let customers = res.locals.customers;
    return customers.some((customer) => name.toUpperCase().startsWith(customer));
}

function hasCustomers(res) {
    return (res.locals.customers ?? []).length > 0;
}

module.exports = {
    hasCustomers,
    isValidCustomer
};
