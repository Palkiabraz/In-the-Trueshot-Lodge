async function fetchTabletopPrice() {
	try {
		const steamUrl =
			'https://store.steampowered.com/api/appdetails?appids=286160&cc=fr&filters=price_overview';

		const corsProxy = 'https://api.allorigins.win/raw?url=';
		const response = await fetch(corsProxy + encodeURIComponent(steamUrl));
		const data = await response.json();

		const priceOverview = data['286160'].data.price_overview;

		if (priceOverview) {
			const finalPrice = (priceOverview.final / 100).toFixed(2);
			const currency = priceOverview.currency;

			document.getElementById('ttprice').textContent =
				`${finalPrice} €`;

			console.log(`Tabletop Simulator Price: ${finalPrice} ${currency}`);
		} else {
			console.log('Price information is not available.');
		}
	} catch (error) {
		console.error('Error fetching price:', error);
	}
}

fetchTabletopPrice();
