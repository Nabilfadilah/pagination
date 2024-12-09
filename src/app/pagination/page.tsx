import {dbConnect} from "@/lib/connectMongo";
import Link from "next/link";
import Image from "next/image";

async function getData(perPage: number, page: number) {
  try {
    // DB Connect
    const client = await dbConnect();
    const db = client.db("next15");

    // DB Query
    const items = await db
      .collection("products")
      .find({})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .toArray();

    const itemCount = await db.collection("products").countDocuments({});

    const respnse = {items, itemCount};
    //console.log(items);
    console.log(itemCount);
    return respnse;
  } catch (error) {
    throw new Error("Failed to fetch data. Please try again later.");
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: {page?: string};
}) {
  let page = parseInt(searchParams.page || "1", 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 4;
  const data = await getData(perPage, page);

  const totalPages = Math.ceil(data.itemCount / perPage);

  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;

  const pageNumbers = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-bold py-10 text-2xl">
            Next.js 14 Pagination MongoDB
          </h1>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th className="py-3 text-left">Image</th>
              <th className="py-3 text-left">Product Name</th>
              <th className="py-3 text-left">Price</th>
              <th className="py-3 text-left">Category</th>
              <th className="py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {data.items.map((item) => (
              <tr
                // key={item._id}
                key={item._id.toString()}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-4 w-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <td>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.category}</td>
                <td>Delete</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isPageOutOfRange ? (
          <div>No more pages...</div>
        ) : (
          <div className="flex justify-center items-center mt-16">
            <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
              {page === 1 ? (
                <div className="opacity-60 py-2 px-5" aria-disabled="true">
                  Previous
                </div>
              ) : (
                <Link
                  href={`?page=${prevPage}`}
                  className="py-2 px-5"
                  aria-label="Previous Page"
                >
                  Previous
                </Link>
              )}

              {pageNumbers.map((pageNumber, index) => (
                <Link
                  key={index}
                  className={
                    page === pageNumber
                      ? "bg-blue-500 font-bold py-2 px-5 rounded text-white"
                      : "bg-gray-500 hover:bg-gray-400 font-bold py-2 px-5 rounded text-white"
                  }
                  href={`?page=${pageNumber}`}
                >
                  {pageNumber}
                </Link>
              ))}

              {page === totalPages ? (
                <div className="opacity-60 py-2 px-5" aria-disabled="true">
                  Next
                </div>
              ) : (
                <Link
                  href={`?page=${nextPage}`}
                  className="py-2 px-5"
                  aria-label="Next Page"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
