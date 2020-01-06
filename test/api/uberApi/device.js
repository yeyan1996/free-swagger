/* eslint-disable */
import axios from "axios";

// 分页上传设备地理坐标信息, 参数list的值为 List<DeviceLngLat>, 返回Result对象
export const uploadLngLatUsingPOST = (params, pathParams) =>
  axios.request({
    url: `/dev/uploadLngLat`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
