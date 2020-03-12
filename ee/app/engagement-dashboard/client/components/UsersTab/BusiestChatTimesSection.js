import { ResponsiveBar } from '@nivo/bar';
import { Box, Button, Chevron, Flex, Margins, Select, Skeleton } from '@rocket.chat/fuselage';
import moment from 'moment';
import React, { useMemo, useState } from 'react';

import { useTranslation } from '../../../../../../client/contexts/TranslationContext';
import { Section } from '../Section';
import { useEndpointData } from '../../hooks/useEndpointData';

function ContentForHours({ displacement, onPreviousDateClick, onNextDateClick }) {
	const currentDate = useMemo(() => moment.utc().subtract(displacement, 'days'), [displacement]);
	const params = useMemo(() => ({ start: currentDate.toISOString() }), [currentDate]);
	const data = useEndpointData('GET', 'engagement-dashboard/users/chat-busier/hourly-data', params);
	const values = data ? data.hours.sort(({ hour: a }, { hour: b }) => a - b) : [];

	return <>
		<Flex.Container alignItems='center' justifyContent='center'>
			<Box>
				<Button ghost square small onClick={onPreviousDateClick}>
					<Chevron left size='20' style={{ verticalAlign: 'middle' }} />
				</Button>
				<Flex.Item basis='25%'>
					<Margins inline='x8'>
						<Box is='span' style={{ textAlign: 'center' }}>
							{currentDate.format(displacement < 7 ? 'dddd' : 'L')}
						</Box>
					</Margins>
				</Flex.Item>
				<Button ghost square small disabled={displacement === 0} onClick={onNextDateClick}>
					<Chevron right size='20' style={{ verticalAlign: 'middle' }} />
				</Button>
			</Box>
		</Flex.Container>
		<Flex.Container>
			{data
				? <Box style={{ height: 196 }}>
					<Flex.Item align='stretch' grow={1} shrink={0}>
						<Box style={{ position: 'relative' }}>
							<Box style={{ position: 'absolute', width: '100%', height: '100%' }}>
								<ResponsiveBar
									data={values}
									indexBy='hour'
									keys={['users']}
									groupMode='grouped'
									padding={0.25}
									margin={{
										// TODO: Get it from theme
										bottom: 20,
									}}
									colors={[
										// TODO: Get it from theme
										'#1d74f5',
									]}
									enableLabel={false}
									enableGridY={false}
									axisTop={null}
									axisRight={null}
									axisBottom={{
										tickSize: 0,
										// TODO: Get it from theme
										tickPadding: 4,
										tickRotation: 0,
										tickValues: 8,
										format: (hour) => moment().set({ hour, minute: 0, second: 0 }).format('LT'),
									}}
									axisLeft={null}
									animate={true}
									motionStiffness={90}
									motionDamping={15}
									theme={{
										// TODO: Get it from theme
										axis: {
											ticks: {
												text: {
													fill: '#9EA2A8',
													fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
													fontSize: '10px',
													fontStyle: 'normal',
													fontWeight: '600',
													letterSpacing: '0.2px',
													lineHeight: '12px',
												},
											},
										},
									}}
								/>
							</Box>
						</Box>
					</Flex.Item>
				</Box>
				: <Skeleton variant='rect' height={196} />}
		</Flex.Container>
	</>;
}

function ContentForDays({ displacement, onPreviousDateClick, onNextDateClick }) {
	const currentDate = useMemo(() => moment.utc().subtract(displacement, 'weeks'), [displacement]);
	const formattedCurrentDate = useMemo(() => {
		const startOfWeekDate = currentDate.clone().subtract(6, 'days');
		return `${ startOfWeekDate.format('L') } - ${ currentDate.format('L') }`;
	}, [currentDate]);
	const params = useMemo(() => ({ start: currentDate.toISOString() }), [currentDate]);
	const data = useEndpointData('GET', 'engagement-dashboard/users/chat-busier/weekly-data', params);
	const values = useMemo(() => (data ? data.month.map(({ users, day, month, year }) => ({
		users,
		day: moment.utc([year, month - 1, day, 0, 0, 0]).valueOf(),
	})).sort(({ day: a }, { day: b }) => a - b) : []), [data]);

	return <>
		<Flex.Container alignItems='center' justifyContent='center'>
			<Box>
				<Button ghost square small onClick={onPreviousDateClick}>
					<Chevron left size='20' style={{ verticalAlign: 'middle' }} />
				</Button>
				<Flex.Item basis='50%'>
					<Margins inline='x8'>
						<Box is='span' style={{ textAlign: 'center' }}>
							{formattedCurrentDate}
						</Box>
					</Margins>
				</Flex.Item>
				<Button ghost square small disabled={displacement === 0} onClick={onNextDateClick}>
					<Chevron right size='20' style={{ verticalAlign: 'middle' }} />
				</Button>
			</Box>
		</Flex.Container>
		<Flex.Container>
			{data
				? <Box style={{ height: 196 }}>
					<Flex.Item align='stretch' grow={1} shrink={0}>
						<Box style={{ position: 'relative' }}>
							<Box style={{ position: 'absolute', width: '100%', height: '100%' }}>
								<ResponsiveBar
									data={values}
									indexBy='day'
									keys={['users']}
									groupMode='grouped'
									padding={0.25}
									margin={{
										// TODO: Get it from theme
										bottom: 20,
									}}
									colors={[
										// TODO: Get it from theme
										'#1d74f5',
									]}
									enableLabel={false}
									enableGridY={false}
									axisTop={null}
									axisRight={null}
									axisBottom={{
										tickSize: 0,
										// TODO: Get it from theme
										tickPadding: 4,
										tickRotation: 0,
										format: (timestamp) => moment(timestamp).format('L'),
									}}
									axisLeft={null}
									animate={true}
									motionStiffness={90}
									motionDamping={15}
									theme={{
										// TODO: Get it from theme
										axis: {
											ticks: {
												text: {
													fill: '#9EA2A8',
													fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
													fontSize: '10px',
													fontStyle: 'normal',
													fontWeight: '600',
													letterSpacing: '0.2px',
													lineHeight: '12px',
												},
											},
										},
									}}
								/>
							</Box>
						</Box>
					</Flex.Item>
				</Box>
				: <Skeleton variant='rect' height={196} />}
		</Flex.Container>
	</>;
}

export function BusiestChatTimesSection() {
	const t = useTranslation();

	const [timeUnit, setTimeUnit] = useState('hours');
	const timeUnitOptions = useMemo(() => [
		['hours', t('Hours')],
		['days', t('Days')],
	], [t]);

	const handleTimeUnitChange = (timeUnit) => {
		setTimeUnit(timeUnit);
	};

	const [displacement, setDisplacement] = useState(0);

	const handlePreviousDateClick = () => setDisplacement((displacement) => displacement + 1);
	const handleNextDateClick = () => setDisplacement((displacement) => displacement - 1);

	const Content = (timeUnit === 'hours' && ContentForHours) || (timeUnit === 'days' && ContentForDays);

	return <Section
		title={t('When is the chat busier?')}
		filter={<Select options={timeUnitOptions} value={timeUnit} onChange={handleTimeUnitChange} />}
	>
		<Content
			displacement={displacement}
			onPreviousDateClick={handlePreviousDateClick}
			onNextDateClick={handleNextDateClick}
		/>
	</Section>;
}