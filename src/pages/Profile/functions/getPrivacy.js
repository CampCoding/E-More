import axios from "axios";
import { base_url } from "../../../constants";

export const getPrivacy = (setPrivacy) => {
  axios
    .get(base_url + '/user/setting/select_policy.php')
    .then((res) => {
      if (res.data.status == 'success') {
        setPrivacy(res.data.message);
      }
    })
    .catch((e) => console.log(e));
};
