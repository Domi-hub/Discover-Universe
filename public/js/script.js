(function() {
    Vue.component("first-component", {
        template: "#template",
        data: function() {
            return {
                image: {},
                comments: [],
                username: "",
                message: ""
            };
        },
        props: ["selectedImage"],
        mounted: function() {
            axios
                .get("/image/" + this.selectedImage)
                .then(resp => {
                    this.image = resp.data;

                    return axios
                        .get("/image/" + this.selectedImage + "/comments")
                        .then(resp => {
                            this.comments = resp.data;
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        methods: {
            close: function() {
                this.$emit("close", true);
            },
            submitComment: function() {
                axios
                    .post("/image/" + this.selectedImage + "/comment", {
                        username: this.username,
                        message: this.message
                    })
                    .then(res => {
                        this.comments.push(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                        this.error = true;
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            username: "",
            desc: "",
            title: "",
            file: null,
            selectedImage: null
        },
        mounted: function() {
            axios
                .get("/images")
                .then(resp => {
                    this.images = resp.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        methods: {
            closeMe: function() {
                this.selectedImage = null;
            },
            upload: function() {
                var form = new FormData();
                form.append("image", this.file);
                form.append("username", this.username);
                form.append("title", this.title);
                form.append("desc", this.desc);
                axios
                    .post("/upload", form)
                    .then(res => {
                        this.images.unshift(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                        this.error = true;
                    });
            },
            fileSelected: function(e) {
                this.file = e.target.files[0];
            }
        }
    });
})();
