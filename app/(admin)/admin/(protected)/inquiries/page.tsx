import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";

import { saveInquiryReviewAction } from "./actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

type InquiriesPageProps = {
  searchParams: Promise<{ selected?: string; saved?: string }>;
};

export default async function AdminInquiriesPage({
  searchParams,
}: InquiriesPageProps) {
  const query = await searchParams;
  const inquiries = await prisma.contactRequest.findMany({
    include: {
      product: true,
      manufacturer: true,
      sourcePage: true,
      sourceLocale: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const selectedInquiry =
    inquiries.find((item) => item.id === query.selected) ?? inquiries[0] ?? null;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Inquiries"
        title="Inbound inquiry queue"
        description="Review database-stored contact submissions, keep operational notes inside the app, and update status without a third-party CRM dependency."
      />

      {query.saved ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Inquiry updated successfully.
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard
          title="Recent submissions"
          description="Each record preserves locale and source context for auditability."
        >
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <a
                key={inquiry.id}
                href={`/admin/inquiries?selected=${inquiry.id}`}
                className="block rounded-3xl border border-line bg-white p-4 transition hover:border-brand"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{inquiry.contactName}</p>
                    <p className="text-sm text-muted">{inquiry.email}</p>
                  </div>
                  <AdminStatusBadge kind="inquiry" status={inquiry.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {inquiry.companyName ?? "No company"} · {inquiry.sourceLocale.code.toUpperCase()} ·{" "}
                  {inquiry.sourcePage?.pageKey ?? "No source page"}
                </p>
                <p className="mt-3 text-sm leading-6">{inquiry.message}</p>
              </a>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Inquiry review"
          description="Status and internal notes are editable. Submitted contact data stays read-only."
        >
          {selectedInquiry ? (
            <form action={saveInquiryReviewAction} className="space-y-4">
              <input type="hidden" name="id" value={selectedInquiry.id} />
              <input type="hidden" name="selected" value={selectedInquiry.id} />

              <div className="rounded-3xl border border-line bg-white p-4 text-sm leading-6">
                <p className="font-semibold">{selectedInquiry.contactName}</p>
                <p className="text-muted">{selectedInquiry.email}</p>
                <p className="mt-3">
                  {selectedInquiry.companyName ?? "No company"} ·{" "}
                  {selectedInquiry.country ?? "No country"}
                </p>
                <p className="mt-3">
                  Context: {selectedInquiry.product?.id ?? "No product"} ·{" "}
                  {selectedInquiry.manufacturer?.id ?? "No manufacturer"}
                </p>
                <p className="mt-3">{selectedInquiry.message}</p>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedInquiry.status}
                  className={selectClassName}
                >
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="answered">Answered</option>
                  <option value="closed">Closed</option>
                  <option value="spam">Spam</option>
                </select>
              </div>

              <div>
                <Label htmlFor="internalNotes">Internal notes</Label>
                <Textarea
                  id="internalNotes"
                  name="internalNotes"
                  defaultValue={selectedInquiry.internalNotes ?? ""}
                  className="min-h-44"
                />
              </div>

              <Button type="submit">Save review</Button>
            </form>
          ) : (
            <p className="text-sm text-muted">No inquiries stored yet.</p>
          )}
        </AdminSectionCard>
      </div>
    </div>
  );
}
