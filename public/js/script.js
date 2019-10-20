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
        props: ["selectedImageId"],
        mounted: function() {
            const myVue = this;
            axios
                .get("/images/" + myVue.selectedImageId)
                .then(resp => {
                    myVue.image = resp.data;

                    return axios
                        .get("/images/" + myVue.selectedImageId + "/comments")
                        .then(resp => {
                            myVue.comments = resp.data;
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
                const myVue = this;
                axios
                    .post("/images/" + myVue.selectedImageId + "/comment", {
                        username: myVue.username,
                        message: myVue.message
                    })
                    .then(res => {
                        myVue.comments.push(res.data);
                    })
                    .catch(err => {
                        myVue.error = true;
                        console.log(err);
                    });
            }
        },
        watch: {
            selectedImageId: function() {
                const myVue = this;
                axios
                    .get("/images/" + this.selectedImageId)
                    .then(resp => {
                        myVue.image = resp.data;

                        return axios
                            .get(
                                "/images/" + myVue.selectedImageId + "/comments"
                            )
                            .then(resp => {
                                myVue.comments = resp.data;
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            hasMoreImages: false,
            username: "",
            description: "",
            title: "",
            file: null,
            selectedImageId: location.hash.slice(1)
        },
        mounted: function() {
            const myVue = this;
            axios
                .get("/images")
                .then(resp => {
                    myVue.images = resp.data;
                    const lastImage = myVue.images[myVue.images.length - 1];
                    myVue.hasMoreImages = lastImage.id > lastImage.lowest_id;
                })
                .catch(err => {
                    console.log(err);
                });

            addEventListener("hashchange", function() {
                myVue.selectedImageId = location.hash.slice(1);
            });
        },
        methods: {
            closeMe: function() {
                this.selectedImageId = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            },
            upload: function() {
                const myVue = this;
                var form = new FormData();
                form.append("image", this.file);
                form.append("username", this.username);
                form.append("title", this.title);
                form.append("desc", this.description);
                axios
                    .post("/upload", form)
                    .then(res => {
                        myVue.images.unshift(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                        myVue.error = true;
                    });
            },
            more: function() {
                const myVue = this;
                axios
                    .get(
                        "/images?lastImageId=" +
                            myVue.images[myVue.images.length - 1].id
                    )
                    .then(resp => {
                        myVue.images = myVue.images.concat(resp.data);
                        const lastImage = myVue.images[myVue.images.length - 1];
                        myVue.hasMoreImages =
                            lastImage.id > lastImage.lowest_id;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            fileSelected: function(e) {
                this.file = e.target.files[0];
            }
        }
    });
})();
