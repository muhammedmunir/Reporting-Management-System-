<script>
	import { fade } from 'svelte/transition';
</script>

<div class="bg-gray-100 min-h-screen flex items-center justify-center px-4">
	<div
		class="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full transition-all duration-300"
		in:fade
	>
		<h1 class="text-2xl md:text-3xl font-bold text-center mb-4">Our Privacy Policy</h1>
		<p class="text-gray-700 text-center mb-6">
			Please read these terms and conditions carefully before using our service. By accessing or
			using our website, you agree to be bound by these terms and conditions.
		</p>

		<ol class="list-decimal list-inside space-y-4">
			<li>
				<h2 class="text-xl md:text-2xl font-semibold mb-2">Data Collection</h2>
				<p class="text-gray-700">
					We may collect personal information such as your name, email address, phone number, and
					other relevant details when you use our service. This information will be used solely for
					the purpose of providing our service and improving our offerings. We will not share your
					personal information with third parties without your consent, except as required by law.
				</p>
			</li>

			<li>
				<h2 class="text-xl md:text-2xl font-semibold mb-2">User Responsibilities</h2>
				<p class="text-gray-700">
					You are responsible for maintaining the confidentiality of your account and password and
					for restricting access to your computer or device. You agree to accept responsibility for
					all activities that occur under your account or password. You should immediately notify us
					of any unauthorized use of your account or any other breach of security.
				</p>
			</li>

			<li>
				<h2 class="text-xl md:text-2xl font-semibold mb-2">Intellectual Property</h2>
				<p class="text-gray-700">
					All content, features, and functionality on our website, including but not limited to
					text, graphics, logos, icons, and images, are the intellectual property of our company and
					are protected by applicable copyright, trademark, and other intellectual property laws.
					You may not modify, reproduce, distribute, or create derivative works from our content
					without our prior written consent.
				</p>
			</li>

			<!-- Add more terms and conditions as needed -->
		</ol>
	</div>
</div>
