import React, { PureComponent } from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Editor } from 'mrbuilder-component-editor';
import PropTypes from 'prop-types';

describe('Editor', function () {

    const makeAndMount = (propTypes) => {
        class Test extends PureComponent {
            static propTypes = propTypes;

            render() {
                return <div>{JSON.stringify(this.props)}</div>
            }
        }

        const attachTo = document.createElement('div');
        document.body.appendChild(attachTo);

        return mount(<Editor component={Test}/>, { attachTo })
    };

    it('should render string', function () {

        const root = makeAndMount({ name: PropTypes.string });

        expect(root.html()).to.eql(
            '<div class="mrbuilder-component-editor_editor_sample undefined"><pre class="mrbuilder-component-editor_editor_code">&lt;<span class="mrbuilder-component-editor_editor_component" title="Click to reset to defaults">Test</span><span class="mrbuilder-component-editor_editor_props"> <span class="mrbuilder-component-editor_property_prop-val"><span class="mrbuilder-component-editor_property_prop-name">name</span><span class="mrbuilder-component-editor_property_eq">=</span><span class="mrbuilder-component-editor_property_left-curly">{</span><span class="mrbuilder-component-editor_property_value-container"><span class="mrbuilder-component-editor_property_value-value"><input type="text" class="mrbuilder-component-editor_editor_input" name="name" size="1"></span></span><span class="mrbuilder-component-editor_property_right-curly">}</span></span> /&gt;</span></pre><div><div>{}</div></div></div>'
        );

    });

    it('should render bool', function () {

        const root = makeAndMount({ test: PropTypes.bool });

        expect(root.html()).to.eql(
            '<div class="mrbuilder-component-editor_editor_sample undefined"><pre class="mrbuilder-component-editor_editor_code">&lt;<span class="mrbuilder-component-editor_editor_component" title="Click to reset to defaults">Test</span><span class="mrbuilder-component-editor_editor_props"> <span class="mrbuilder-component-editor_property_prop-val"><span class="mrbuilder-component-editor_property_prop-name">test</span><span class="mrbuilder-component-editor_property_eq">=</span><span class="mrbuilder-component-editor_property_left-curly">{</span><span class="mrbuilder-component-editor_property_value-container"><span class="mrbuilder-component-editor_property_value-value"><input type="checkbox" id="test-check" name="test" value="on" style="visibility: hidden;"><label for="test-check" class="mrbuilder-component-editor_editor_value-value mrbuilder-component-editor_editor_checkbox">false</label></span></span><span class="mrbuilder-component-editor_property_right-curly">}</span></span> /&gt;</span></pre><div><div>{"test":false}</div></div></div>'
        );

    });

    it('should render select', function () {

        const root = makeAndMount(
            { select: PropTypes.oneOf(['one', 'two', 'three']) });

        expect(root.html()).to.eql(
            '<div class="mrbuilder-component-editor_editor_sample undefined"><pre class="mrbuilder-component-editor_editor_code">&lt;<span class="mrbuilder-component-editor_editor_component" title="Click to reset to defaults">Test</span><span class="mrbuilder-component-editor_editor_props"> <span class="mrbuilder-component-editor_property_prop-val"><span class="mrbuilder-component-editor_property_prop-name">select</span><span class="mrbuilder-component-editor_property_eq">=</span><span class="mrbuilder-component-editor_property_left-curly">{</span><span class="mrbuilder-component-editor_property_value-container"><span class="mrbuilder-component-editor_property_value-value"><select class="select" name="select"><option value="one">one</option><option value="two">two</option><option value="three">three</option></select></span></span><span class="mrbuilder-component-editor_property_right-curly">}</span></span> /&gt;</span></pre><div><div>{}</div></div></div>'
        );

    });
});
