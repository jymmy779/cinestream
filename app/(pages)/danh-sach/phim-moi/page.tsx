import { permanentRedirect } from "next/navigation";

export default function OldNewMoviesRedirect() {
    permanentRedirect("/danh-sach/phim-moi-cap-nhat");
}
