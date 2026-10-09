import { CompetitionReviewItem } from '../types';
import { DEFAULT_REVIEWS_DATA } from '../data/portfolioData';

export function getText(block: any): string {
  if (!block || !block.properties || !block.properties.title) return '';
  return block.properties.title.map((t: any) => t[0]).join('');
}

export function getChildren(blocks: Record<string, any>, block: any): any[] {
  if (!block || !block.content) return [];
  return block.content
    .map((cid: string) => {
      const b = blocks[cid];
      return b?.value?.value || b?.value || b;
    })
    .filter(Boolean);
}

export function parseNotionBlocksToReview(
  blocks: Record<string, any>,
  rootId: string = '3b21be0c-b00f-802d-9956-ed228decbaff'
): CompetitionReviewItem {
  const normId = rootId.includes('-')
    ? rootId
    : `${rootId.slice(0, 8)}-${rootId.slice(8, 12)}-${rootId.slice(12, 16)}-${rootId.slice(16, 20)}-${rootId.slice(20)}`;

  const root = blocks[normId]?.value?.value || blocks[normId]?.value || blocks[normId];
  const pageTitle = (root ? getText(root) : '') || 'WRO Open Championship 2026 India- ASIA PACIFIC';

  // Base review with updated default content
  const review: CompetitionReviewItem = JSON.parse(JSON.stringify(DEFAULT_REVIEWS_DATA[0]));
  review.title = pageTitle;
  review.lastSyncedAt = new Date().toISOString();
  review.updatedAt = new Date().toISOString();

  if (!blocks || Object.keys(blocks).length === 0) {
    return review;
  }

  try {
    // Helper to retrieve block
    const getB = (id: string) => {
      const b = blocks[id];
      return b?.value?.value || b?.value || b;
    };

    // Helper to gather all nested text in a block
    const getDeepText = (b: any): string => {
      if (!b) return '';
      let str = getText(b);
      if (b.content && Array.isArray(b.content)) {
        for (const cid of b.content) {
          const childB = getB(cid);
          if (childB) {
            str += '\n' + getDeepText(childB);
          }
        }
      }
      return str;
    };

    // Traverse root content to find sections
    const contentIds: string[] = root?.content || [];
    let currentMainHeader = '';

    for (const cid of contentIds) {
      const b = getB(cid);
      if (!b) continue;

      const type = b.type;
      const text = getText(b).trim();

      if (type === 'header') {
        currentMainHeader = text;
      }

      // 1. Column list for Team & Competition Site
      if (type === 'column_list' && b.content) {
        for (const colId of b.content) {
          const colBlock = getB(colId);
          if (colBlock?.content) {
            for (const childId of colBlock.content) {
              const childB = getB(childId);
              const cText = getText(childB);
              if (cText.includes('팀 명') && childB.content) {
                const bullets = childB.content.map((bid: string) => getText(getB(bid))).filter(Boolean);
                if (bullets[0]) review.teamName = bullets[0];
                if (bullets[1]) {
                  review.members = bullets[1].split(',').map((m: string) => m.trim());
                }
              }
            }
          }
        }
      }

      // 2. Day 1 sections
      if (currentMainHeader.includes('첫째 날')) {
        if (text.includes('연습 날 있었던 문제점') && b.content) {
          const pList: string[] = [];
          const dList: { problem: string; solution: string }[] = [];
          for (const pid of b.content) {
            const pb = getB(pid);
            if (pb && pb.type === 'numbered_list') {
              const pText = getText(pb);
              pList.push(pText);
              // Check sub-solutions under problem
              let sol = '';
              if (pb.content) {
                for (const sid of pb.content) {
                  const sb = getB(sid);
                  const st = getText(sb);
                  if (st.includes('수정 방법') && sb.content) {
                    sol = sb.content.map((sbid: string) => getText(getB(sbid))).join(' ');
                  }
                }
              }
              if (sol) dList.push({ problem: pText, solution: sol });
            }
          }
          if (pList.length > 0) review.day1.fixes = pList;
          if (dList.length > 0) review.day1.fixesDetailed = dList;
        }

        if (text.includes('최종 전략') && b.content) {
          const strat = getText(getB(b.content[0]));
          if (strat) review.day1.strategy = strat;
          for (const sbid of b.content) {
            const sb = getB(sbid);
            if (getText(sb).includes('이유') && sb.content) {
              const reason = getText(getB(sb.content[0]));
              if (reason) review.day1.strategyReason = reason;
            }
          }
        }

        if (type === 'callout') {
          const calloutText = getDeepText(b);
          if (calloutText.includes('11등') || calloutText.includes('점')) {
            const lines = calloutText.split('\n').filter(Boolean);
            if (lines[0]) review.day1.result = lines[0];
          }
        }
      }

      // 3. Day 2 sections
      if (currentMainHeader.includes('둘째 날')) {
        if (text.includes('surprise mission') && b.content) {
          for (const sId of b.content) {
            const sb = getB(sId);
            const st = getText(sb);
            if (st.includes('규칙') && sb.content) {
              const rule = getText(getB(sb.content[0]));
              if (rule && review.day2.surpriseMission) review.day2.surpriseMission.rules = rule;
            }
            if (st.includes('시도 x') && sb.content) {
              for (const reasonId of sb.content) {
                const rText = getText(getB(reasonId));
                if (rText.includes('이유') && review.day2.surpriseMission) {
                  review.day2.surpriseMission.reason = rText.replace(/^이유\s*:\s*/, '').trim();
                } else if (rText.includes('불이익') && review.day2.surpriseMission) {
                  review.day2.surpriseMission.disadvantage = rText.replace(/^불이익\s*:\s*/, '').trim();
                }
              }
            }
            if (st.includes('다음에 시도 하기 위한 대책') && sb.content && review.day2.surpriseMission) {
              review.day2.surpriseMission.lesson = getText(getB(sb.content[0]));
            }
          }
        }

        if (text.includes('둘째 날에 일어난 문제점') && b.content) {
          const prob = getText(getB(b.content[0]));
          let sol = '';
          const pb = getB(b.content[0]);
          if (pb?.content) {
            for (const subId of pb.content) {
              const subB = getB(subId);
              if (getText(subB).includes('수정 방법') && subB.content) {
                sol = getText(getB(subB.content[0]));
              }
            }
          }
          if (prob && sol && review.day2.problemAndFix) {
            review.day2.problemAndFix = { problem: prob, solution: sol };
          }
        }

        if (text.includes('고쳐야 했던 점') && b.content) {
          const mf = getText(getB(b.content[0]));
          if (mf) review.day2.mustFix = mf;
        }
      }

      // 4. Day 3 sections
      if (currentMainHeader.includes('셋째 날')) {
        if (text.includes('셋째 날에서 일어난 문제점') && b.content) {
          const prob = getText(getB(b.content[0]));
          let sol = '';
          const pb = getB(b.content[0]);
          if (pb?.content) {
            for (const subId of pb.content) {
              const subB = getB(subId);
              if (getText(subB).includes('수정 방법') && subB.content) {
                sol = getText(getB(subB.content[0]));
              }
            }
          }
          if (prob && sol && review.day3.problemAndFix) {
            review.day3.problemAndFix = { problem: prob, solution: sol };
          }
        }

        if (text.includes('고쳐야 했던 점') && b.content) {
          const mf = getText(getB(b.content[0]));
          if (mf) review.day3.mustFix = mf;
        }

        if (text.includes('시도 했던 미션') && b.content) {
          const sTasks = b.content.map((tid: string) => getText(getB(tid))).filter(Boolean);
          if (sTasks.length > 0) review.day3.strategyTasks = sTasks;
        }
      }

      // 5. Reflections (느낀 점)
      if (text.includes('느낀 점')) {
        // Find sub sections under reflections
      }
      if (text.includes('좋았던 점') && b.content) {
        const str = getText(getB(b.content[0]));
        if (str) review.reflections.strengths = str;
      }
      if (text.includes('아쉬웠던 점') && b.content) {
        const reg = getText(getB(b.content[0]));
        if (reg) review.reflections.regrets = reg;
      }
      if (text.includes('부족했던 점') && b.content) {
        const imp = getText(getB(b.content[0]));
        if (imp) review.reflections.improvements = imp;
      }
      if (text.includes('실수') && b.content) {
        const mist = b.content.map((mid: string) => getText(getB(mid))).filter(Boolean);
        if (mist.length > 0) review.reflections.mistakesList = mist;
      }

      // 6. Competition Details
      if (text.includes('대회 룰 중 중요했던 규칙') && b.content) {
        const rule = getText(getB(b.content[0]));
        if (rule) review.competitionDetails.criticalRules = rule;
      }
      if (text.includes('대회 규칙 중 모르는 게 있어서 피해를 본 것') && b.content) {
        const ruleLesson = getText(getB(b.content[0]));
        if (ruleLesson) review.competitionDetails.ruleLessonLearned = ruleLesson;
      }
      if (text.includes('작년 대회와 달랐던 점') && b.content) {
        const diff = getText(getB(b.content[0]));
        if (diff) review.competitionDetails.differencesFromPrevious = diff;
      }
    }
  } catch (err) {
    console.warn('[notionParser] Parse warning, using updated defaults:', err);
  }

  return review;
}
