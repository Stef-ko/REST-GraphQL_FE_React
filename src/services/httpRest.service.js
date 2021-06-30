import http from "../http-common";

class httpRestService {
  getAll() {
    return http.get("/posts");
  }

  // get(id) {
  //   return http.get(`/post/${id}`);
  // }

  create(body) {
    return http.post("/posts/newpost", {
      body: body,
    });
  }

  update(id, body) {
    return http.put(`posts/updatepost/${id}`, {
      body: body,
    });
  }

  delete(id) {
    return http.delete(`/posts/${id}`);
  }
}
export default new httpRestService();
