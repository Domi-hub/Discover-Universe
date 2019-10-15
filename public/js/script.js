(function() {
    new Vue({
        el: "#main",
        data: {
            title: "Latest Images",
            images: [],
            username: "",
            desc: "",
            title: "",
            file: null
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            console.log("mounted!");
            var myVue = this;
            axios
                .get("/images")
                .then(resp => {
                    console.log(resp.data, this);
                    myVue.images = resp.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        updated: function() {
            console.log("updated!");
        },
        methods: {
            upload: function() {
                console.log(this.username, this.title, this.desc, this.file);
                var fd = new FormData();
                fd.append("image", this.file);
                fd.append("username", this.username);
                fd.append("title", this.title);
                fd.append("desc", this.desc);
                axios.post("/upload", fd).then(function(res) {});

                // axios.post("/some-route", {
                //     username: username,
                //     title: title
                // });
            },
            fileSelected: function(e) {
                console.log(e.target.files);
                this.file = e.target.files[0];
            }
        }
    });
})();
