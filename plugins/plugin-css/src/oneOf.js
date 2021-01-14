const oneOf    = [];
oneOf.name     = '@mrbuilder/plugin-css/oneOf';
module.exports = {
    oneOf,
    isOneOf(v) {
        return v === oneOf || v && v.oneOf === oneOf;
    }
};