import { useBrowser } from 'lib/BrowserContext';
import { Platform, usePlatform } from 'lib/PlatformContext';
import { Icon } from '@iconify/react';
import HistoryFileBox from 'components/HistoryFileBox';
import useLeaveConfirmation from 'lib/useLeaveConfirmation';

export default function HistoryScanner() {
	useLeaveConfirmation();

	const [platform] = usePlatform();
	const [browser] = useBrowser();

	const effectiveBrowser = (
		browser === 'firefox' || browser === 'opera'
			? browser
			: 'chrome'
	);

	const urlToOpen = {
		chrome: 'chrome://version',
		firefox: 'about:profiles',
		opera: 'opera://about'
	}[effectiveBrowser];

	const historyFilename = (
		browser === 'firefox'
			? 'places.sqlite'
			: 'History'
	);

	const openDirectoryButtonText = browser === 'firefox' && {
		windows: 'Open Folder',
		mac: 'Show in Finder',
		linux: 'Open Directory'
	}[platform as Exclude<Platform, 'mobile'>];

	const profilePathText = browser !== 'firefox' && (
		browser === 'opera'
			? 'Profile'
			: 'Profile Path'
	);

	return (
		<main style={{ maxWidth: '700px' }}>
			<h1>Last step!</h1>
			<ol>
				<li>
					Open a new tab, and go to the URL <code>{urlToOpen}</code>.
				</li>
				{browser === 'firefox' ? (
					<>
						<li>
							<p>
								Find the box that says "<b>This is the profile in use and it cannot be deleted.</b>" It looks like this:
							</p>
							<img className="screenshot" src={`/recover/history/firefox-${platform}.png`} />
						</li>
						<li>
							Next to <b>Root Directory</b>, click the <span className="fake-button">{openDirectoryButtonText}</span> button, outlined in red above.
						</li>
					</>
				) : (
					<>
						<li>
							<p>
								Find "<b>{profilePathText}:</b>" and copy the text next to it, outlined in red below:
							</p>
							<img className="screenshot" src={`/recover/history/${effectiveBrowser}-${platform}.png`} />
						</li>
						{platform === 'windows' ? (
							<li>
								{'Press '}
								<kbd>
									<Icon
										icon="mdi:microsoft-windows"
										height={16}
										inline
									/>
									Windows
								</kbd>
								{' + '}<kbd>R</kbd>, paste the text into the box that appears, and press <kbd>Enter</kbd>.
							</li>
						) : platform === 'mac' ? (
							<li>
								Open Finder, press
								<kbd>
									<Icon
										icon="material-symbols:keyboard-command-key"
										height={16}
										inline
									/>
									Command
								</kbd>
									{' + '}<kbd>Shift</kbd> + <kbd>G</kbd>, paste the text into the box that appears, and press <kbd>Enter</kbd>.
							</li>
						) : (
							<li>
								Open the directory path you copied. To do that, open a new terminal window, type <code>xdg-open</code>, add a space afterward, paste the path, and then press <kbd>Enter</kbd>.
							</li>
						)}
					</>
				)}
				<li>
					In the folder that opened, find the file{!historyFilename.includes('.') && ' (not folder)'} named <code>{historyFilename}</code>, and drag and drop it into the box below (don't worry, it will only be scanned locally, not uploaded):
				</li>
			</ol>
			<HistoryFileBox historyFilename={historyFilename} />
		</main>
	);
}
