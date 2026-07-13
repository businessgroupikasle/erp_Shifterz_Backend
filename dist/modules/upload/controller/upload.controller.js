export class UploadController {
    handleUpload = (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }
            res.json({ url: `/uploads/${req.file.filename}` });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=upload.controller.js.map