import { mount } from 'enzyme';
import App from 'app';

describe('Sample app test', function () {
    it('should render App', function () {
        expect(mount(<App/>).find('h1').text()).to.eql('Hello from App');
    })
});
