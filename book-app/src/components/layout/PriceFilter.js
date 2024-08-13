import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PriceFilter = () => {
  return (
    <div
      class="col-md-3 d-none d-md-block bg-light mt-3 align-self-start "
      style={{ padding: "20px" }}
    >
      <form class="mt-3 ">
        <div class="mb-3">
          <label class="form-label bg-primary w-100 p-2 rounded-3 text-white">
            Khoảng giá:
          </label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range0"
              value="0:max"
            ></input>
            <label class="form-check-label " for="range0">
              Tất cả
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range1"
              value="0:100000"
            />
            <label class="form-check-label" for="range1">
              Nhỏ hơn 100,000₫
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range2"
              value="100000:200000"
            />
            <label class="form-check-label" for="range2">
              Từ 100,000₫ - 200,000₫
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range3"
              value="200000:300000"
            />
            <label class="form-check-label" for="range3">
              Từ 200,000₫ - 300,000₫
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range4"
              value="300000:400000"
            />
            <label class="form-check-label" for="range4">
              Từ 300,000₫ - 400,000₫
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range5"
              value="400000:500000"
            />
            <label class="form-check-label" for="range5">
              Từ 400,000₫ - 500,000₫
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="priceRange"
              id="range6"
              value="500000:max"
            ></input>
            <label class="form-check-label" for="range6">
              Lớn hơn 500,000₫
            </label>
          </div>
        </div>
        <div className="d-grid">
          <button
            type="button"
            class="btn btn-primary"
            onclick="price_filter()"
          >
            Lọc
          </button>
        </div>
      </form>
    </div>
  );
};

export default PriceFilter;
