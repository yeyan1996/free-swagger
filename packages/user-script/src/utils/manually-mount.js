import ApiIcons from "@/components/ApiIcons";
import InterfaceIcon from "@/components/InterfaceIcon";
import Vue from "vue";

const InterfaceIconCtor = Vue.extend(InterfaceIcon);
const ApiIconsCtor = Vue.extend(ApiIcons);

export const createInterfaceIconDom = interfaceName => {
  const instance = new InterfaceIconCtor({
    propsData: {
      interfaceName
    }
  }).$mount();
  return instance.$el;
};

export const createApiIconsDom = (path, method, summary) => {
  const instance = new ApiIconsCtor({
    propsData: {
      path,
      method,
      summary
    }
  }).$mount();
  return instance.$el;
};
