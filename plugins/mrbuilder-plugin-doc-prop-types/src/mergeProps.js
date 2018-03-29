import toReactDoc from './toReactDoc';
const has        = Function.call.bind(Object.prototype.hasOwnProperty);
const mergeProps = (Clazz, parsedProps = {}) => {
    const docProps = toReactDoc(Clazz);
    return Object.keys(docProps).reduce(function (ret, key) {
        if (!has(ret, key)) {
            ret[key] = docProps[key];
        } else if (!has(ret[key], 'defaultValue')) {
            if (has(docProps[key], 'defaultValue') && has(
                    docProps[key].defaultValue, 'value')) {
                ret[key].defaultValue = docProps[key];
            }
        }

        return ret;
    }, parsedProps);
};

const descend = function (conf) {
    if (conf.sections) {
        conf.sections = conf.sections.map(function (section) {
            if (section.components) {
                section.components =
                    section.components.map(function (component) {
                        const mod = component.module
                                    && (component.module.default
                                        || component.module);
                        if (!mod) {
                            return component;
                        }
                        component.props.props =
                            mergeProps(mod, component.props.props);
                        return component;
                    })
            }
            descend(section);
            return section;
        })
    }
    return conf;
};

export default descend;
