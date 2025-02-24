"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";

export async function createPost(formData: FormData) {
  // get actual user
  const { user } = await verifyAuth();

  if (!user) {
    throw new Error("You must be logged in to create a post.");
  }
  const keys = [
    "title",
    "image",
    "content",
    "location",
    "salary",
    "jobContract",
    "company",
    "field",
    "seniority",
    "languages",
    "technologies",
    "requirements",
    "skills",
    "benefits",
  ] as const;
  const formValues = Object.fromEntries(
    keys.map((key) => [key, formData.get(key)])
  );

  const {
    title,
    image,
    content,
    location,
    salary,
    jobContract,
    company,
    field,
    seniority,
    languages,
    technologies,
    requirements,
    skills,
    benefits,
  } = formValues;

  const errors: string[] = [];

  //  typescript validation: control null values
  function isValidString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }
  // validation
  if (!isValidString(title)) errors.push("Title is required.");
  if (!isValidString(content)) errors.push("Content is required.");
  if (!isValidString(location)) errors.push("Location is required.");
  if (!isValidString(salary)) errors.push("Salary is required.");
  if (!isValidString(jobContract)) errors.push("JobContract is required.");
  if (!isValidString(company)) errors.push("Company is required.");
  if (!isValidString(field)) errors.push("Field is required.");
  if (!isValidString(seniority)) errors.push("Seniority is required.");
  if (!isValidString(languages)) errors.push("Languages are required.");
  if (!isValidString(technologies)) errors.push("Technologies are required.");
  if (!isValidString(requirements)) errors.push("Requirements are required.");
  if (!isValidString(skills)) errors.push("Skills are required.");
  if (!isValidString(benefits)) errors.push("Benefits are required.");
  if (!image || !(image instanceof File) || image.size === 0) {
    errors.push("Image is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    imageUrl = await uploadImage(image as File);
  } catch (error) {
    throw new Error(
      "Image upload failed,post was not created. Please try again later"
    );
  }

  await storePost({
    imageUrl: imageUrl,
    title,
    content,
    userId: user.id,
    location,
    salary,
    jobContract,
    company,
    field,
    seniority,
    languages,
    technologies,
    requirements,
    skills,
    benefits,
  });
  revalidatePath("/", "layout");
  redirect("/feed");
}
