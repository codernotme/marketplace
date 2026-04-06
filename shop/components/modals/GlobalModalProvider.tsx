"use client";

import { useUIStore } from "@/lib/store";
import { BrandModal } from "./BrandModal";
import { ProductModal } from "./ProductModal";
import { CouponModal } from "./CouponModal";
import { BannerModal } from "./BannerModal";
import { CategoryModal } from "./CategoryModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { BlogModal } from "./BlogModal";
import { PageModal } from "./PageModal";

export function GlobalModalProvider() {
  const { activeModal, closeModal, modalMode, modalData } = useUIStore();

  if (!activeModal) return null;

  return (
    <>
      {activeModal === "category" && (
        <CategoryModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
      {activeModal === "brand" && (
        <BrandModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
      {activeModal === "product" && (
        <ProductModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
      {activeModal === "coupon" && (
        <CouponModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
      {activeModal === "banner" && (
        <BannerModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
      {activeModal === "order" && (
        <OrderDetailsModal
          isOpen={true}
          onClose={closeModal}
          data={modalData}
        />
      )}
      {activeModal === "blog" && (
        <BlogModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
      {activeModal === "page" && (
        <PageModal
          isOpen={true}
          onClose={closeModal}
          mode={modalMode}
          data={modalData}
        />
      )}
    </>
  );
}
