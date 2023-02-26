import type { IHttpResp } from "@/model/httpResType";

export const parseResponseData = async (response: Response) => {
  let ret: IHttpResp = {
    code: 0,
    data: undefined,
  };
  try {
    const responseData = await response.json();
    ret.data = responseData.data;
  } catch (e) {
    // console.log("e ",e)
  }

  ret.data = !!ret.data
    ? ret.data
    : !!response.statusText
    ? response.statusText
    : `Error code: ${response.status}`;

  ret.code = response.status;
  return ret;
};

export const apiBase = "/dev";
