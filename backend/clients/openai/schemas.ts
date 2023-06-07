export interface StandardContract {
	 // Name of the vendor who sells the item
  supplier: string;
	// Quote or order number, empty if there is no matching information
  orderId: string | null;
	// When the order is placed
	orderDate: string;
	// List of addresses of the customer
  customerAddresses: string[];
	// Country of the customer
  country: string;
	// Item groups
	itemGroups: {
		name: string; // Name of the item group
		items: {
			name: string; // Name of the item
			quantity: string | null; // Number of unit(s) of the item, null if not applicable
			unitPrice: string | null; // Unit price of the item, null if not applicable
			contractTerm: string | null; // Length of the contract for the item in months, null if not applicable
			monthlyCharge: string | null; // Monthly payment for the item, null if not applicable
			contractStartDate: string | null; // Date when billing starts, null if not applicable
			contractEndDate: string | null; // Date when billing ends, null if not applicable
		}[],
		subtotal: string; // Subtotal amount of the item group
		tax: string; // Tax amount of the item group
		total: string; // Total amount of the item group
	}[],
  total: string; // Total value of the entire contract, including all item groups
  renewalNoticeDays: string; // Days in advance to give customers renewal notice
  autoRenew: boolean; // If the contract can be auto-renewed
}