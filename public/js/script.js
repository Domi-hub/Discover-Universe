(function() {
    Vue.component("first-component", {
        template: "#template",
        data: function() {
            return {
                image: {}
            };
        },
        props: ["selectedImage"],
        mounted: function() {
            var myVue = this;
            axios
                .get("/image/" + this.selectedImage)
                .then(resp => {
                    myVue.image = resp.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        methods: {
            close: function() {
                console.log("emitting from the component...");
                this.$emit("close", true);
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
            var myVue = this;
            axios
                .get("/images")
                .then(resp => {
                    myVue.images = resp.data;
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
                var myVue = this;
                var fd = new FormData();
                fd.append("image", this.file);
                fd.append("username", this.username);
                fd.append("title", this.title);
                fd.append("desc", this.desc);
                axios
                    .post("/upload", fd)
                    .then(function(res) {
                        myVue.images.unshift(res.data);
                    })
                    .catch(function() {
                        myVue.error = true;
                    });
            },
            fileSelected: function(e) {
                this.file = e.target.files[0];
            }
        }
    });
})();
