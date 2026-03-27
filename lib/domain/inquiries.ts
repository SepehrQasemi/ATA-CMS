import { InquiryStatus, type Prisma } from "@prisma/client";

import {
  inquirySubmissionSchema,
  type InquirySubmissionInput,
} from "@/lib/validation/inquiries";
import { inquiryReviewSchema, type InquiryReviewInput } from "@/lib/validation/cms";

type ContactRequestRepository = {
  contactRequest: {
    create(args: { data: Prisma.ContactRequestUncheckedCreateInput }): Promise<{
      id: string;
    }>;
    update(args: {
      where: { id: string };
      data: Prisma.ContactRequestUncheckedUpdateInput;
    }): Promise<{ id: string }>;
  };
};

export async function createInquiryRecord(
  repository: ContactRequestRepository,
  input: InquirySubmissionInput,
) {
  const data = inquirySubmissionSchema.parse(input);

  return repository.contactRequest.create({
    data: {
      requestType: data.requestType,
      status: InquiryStatus.new,
      sourceLocaleCode: data.sourceLocaleCode,
      sourcePageId: data.sourcePageId,
      productId: data.productId,
      manufacturerId: data.manufacturerId,
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      message: data.message,
      consentToContact: data.consentToContact,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    },
  });
}

export async function updateInquiryReview(
  repository: ContactRequestRepository,
  input: InquiryReviewInput,
) {
  const data = inquiryReviewSchema.parse(input);

  return repository.contactRequest.update({
    where: { id: data.id },
    data: {
      status: data.status,
      internalNotes: data.internalNotes,
    },
  });
}
