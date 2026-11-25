import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cloudinaryLoader } from "./cloudinaryLoader.ts";

const URL_IN = "https://res.cloudinary.com/demo/image/upload/v1699999999/shoproom/covers/shop.jpg";

describe("cloudinaryLoader", () => {
  it("asks Cloudinary for the requested width in the best format and automatic quality", () => {
    assert.equal(
      cloudinaryLoader({ src: URL_IN, width: 640 }),
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_640/v1699999999/shoproom/covers/shop.jpg",
    );
  });

  it("uses an explicit quality when one is given and rounds the width", () => {
    assert.match(cloudinaryLoader({ src: URL_IN, width: 383.6, quality: 60 }), /\/f_auto,q_60,c_limit,w_384\//);
  });

  it("keeps any transformation already in the URL", () => {
    const withTransform = "https://res.cloudinary.com/demo/image/upload/e_grayscale/v1/a.jpg";
    assert.equal(
      cloudinaryLoader({ src: withTransform, width: 100 }),
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_100/e_grayscale/v1/a.jpg",
    );
  });

  it("returns every other URL unchanged", () => {
    for (const src of [
      "https://images.unsplash.com/photo-1?w=800",
      "https://api.dicebear.com/9.x/initials/svg?seed=A",
      "http://res.cloudinary.com/demo/image/upload/v1/a.jpg",
      "https://res.cloudinary.com.evil.example/demo/image/upload/v1/a.jpg",
      "https://res.cloudinary.com/demo/image/fetch/https://evil.example/x.png",
      "https://res.cloudinary.com/demo/video/upload/v1/a.mp4",
      "data:image/png;base64,iVBORw0KGgo=",
      "blob:https://shoproom.example/1234",
      "/local/image.png",
    ]) {
      assert.equal(cloudinaryLoader({ src, width: 640 }), src, src);
    }
  });
});
