const ImmportService = require("../../service/ImmportService");

test("Biosample metadata", () => {
    const data = ImmportService.fetchBiosampleMetadata().resolves();
    console.log(data);
});