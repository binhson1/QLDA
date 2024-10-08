const Carousel = () => {
  return (
    <div id="carouselExampleInterval" class="carousel carousel-dark slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="3" aria-label="Slide 4"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
          <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img4.jpg?v=558" class="d-block w-100" style={{ maxHeight: "542px" }} alt="..." />
        </div>
        <div class="carousel-item" data-bs-interval="2000">
          <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img2.jpg?v=558" class="d-block w-100" style={{ maxHeight: "542px" }} alt="..." />
        </div>
        <div class="carousel-item">
          <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img5.jpg?v=558" class="d-block w-100" style={{ maxHeight: "542px" }} alt="..." />
        </div>
        <div class="carousel-item">
          <img src="https://thaihabooks.com/wp-content/uploads/2023/06/z4430407528688_3558c80b33ad321c9e8e321b8e4c80c8.jpg" class="d-block w-100" style={{ maxHeight: "542px" }} alt="..." />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Carousel;
