import { GetServerSideProps } from "next";
import { requireAuth } from "../lib/auth";
import { useEffect, useState } from "react";
import { Listing } from "../types";
import { useFeedback } from "../context/FeedbackContext";
import Link from "next/link";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  requireAuth(ctx);
  return { props: {} };
};

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { showMessage } = useFeedback();
  const router = useRouter();
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/listings");
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.log(error);
      showMessage("Error fetching listings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    let filtered = listings;

    if (filterStatus !== "all") {
      filtered = filtered.filter((listing) => listing.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.id.toString().includes(searchTerm)
      );
    }

    setFilteredListings(filtered);
  }, [listings, filterStatus, searchTerm]);

  const handleAction = async (id: number, action: string) => {
    try {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      showMessage(`${action} action performed successfully`);
      fetchListings();
    } catch (error) {
      console.log(error);
      showMessage("Error performing action");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === "all") return listings.length;
    return listings.filter((listing) => listing.status === status).length;
  };

  const filterOptions = [
    { value: "all", label: "All Listings", count: getStatusCount("all") },
    { value: "pending", label: "Pending", count: getStatusCount("pending") },
    { value: "approved", label: "Approved", count: getStatusCount("approved") },
    { value: "rejected", label: "Rejected", count: getStatusCount("rejected") },
  ];

  const handleLogout = () => {
    document.cookie = "token=; path=/;";
    router.replace("/");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage car listings and track activities
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/audit-log">
                <span className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Audit Trail
                </span>
              </Link>
              <span
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
              >
                Logout
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilterStatus(option.value as FilterStatus)
                    }
                    className={`px-4 py-2 rounded-lg border transition-all font-medium ${
                      filterStatus === option.value
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        filterStatus === option.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by car name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredListings.length}</span> of{" "}
            <span className="font-semibold">{listings.length}</span> listings
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading listings...</span>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No listings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Car
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{listing.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{listing.car}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            listing.status
                          )}`}
                        >
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {listing.status !== "approved" && (
                            <button
                              onClick={() =>
                                handleAction(listing.id, "approved")
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                            >
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </button>
                          )}
                          {listing.status !== "rejected" && (
                            <button
                              onClick={() =>
                                handleAction(listing.id, "rejected")
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                            >
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Reject
                            </button>
                          )}
                          <Link href={`/edit/${listing.id}`}>
                            <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
