import { Module } from "@/types";

export const module1: Module = {
  id: "lv1-drawing-basics",
  level: 1,
  name: "Drawing Basics",
  nameVi: "Cơ bản bản vẽ kỹ thuật",
  description: "Fundamental terms for reading engineering drawings",
  words: [
    {
      id: "w001",
      term: "orthographic projection",
      ipa: "/ˌɔːr.θəˈɡræf.ɪk prəˈdʒek.ʃən/",
      pronunciationHint: "o-thờ-GRÁP-phích prờ-DCHÉC-shần",
      partOfSpeech: "noun",
      definitionEn:
        "A method of representing a 3D object by projecting its views onto 2D planes (front, top, side) at right angles.",
      definitionVi:
        "Phép chiếu vuông góc — phương pháp biểu diễn vật thể 3D bằng cách chiếu các hình chiếu lên mặt phẳng 2D (đứng, bằng, cạnh).",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "Engineering drawings typically use orthographic projection to show the front, top, and right-side views.",
          sentenceVi:
            "Bản vẽ kỹ thuật thường dùng phép chiếu vuông góc để thể hiện hình chiếu đứng, bằng và cạnh.",
          highlightTerm: "orthographic projection",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Please provide the orthographic projection views so we can verify the overall dimensions.",
          highlightTerm: "orthographic projection",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "Can you describe the difference between first-angle and third-angle orthographic projection?",
          highlightTerm: "orthographic projection",
        },
      ],
      collocations: [
        { text: "first-angle projection", type: "related" },
        { text: "third-angle projection", type: "related" },
        { text: "orthographic views", type: "common" },
        {
          text: "Dễ nhầm: projection ≠ perspective (phối cảnh)",
          type: "confused",
        },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "Engineering drawings use _____ to show multiple 2D views of a 3D object.",
          options: [
            "orthographic projection",
            "perspective view",
            "isometric drawing",
            "cross section",
          ],
          correctAnswer: "orthographic projection",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "Which best describes orthographic projection?",
          options: [
            "A 3D rendered image of a part",
            "A method of showing 2D views at right angles",
            "A way to measure tolerances",
            "A type of cross-sectional view",
          ],
          correctAnswer: "A method of showing 2D views at right angles",
        },
      ],
    },
    {
      id: "w002",
      term: "section view",
      ipa: "/ˈsek.ʃən vjuː/",
      pronunciationHint: "SÉC-shần viu",
      partOfSpeech: "noun",
      definitionEn:
        "A view that shows the internal features of an object by imagining it cut along a plane, with the cut surface cross-hatched.",
      definitionVi:
        "Mặt cắt — hình chiếu thể hiện cấu tạo bên trong chi tiết bằng cách tưởng tượng cắt dọc theo một mặt phẳng, vùng cắt được gạch chéo.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The section view A-A reveals the internal bore diameter and wall thickness.",
          highlightTerm: "section view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Could you add a section view to clarify the internal groove dimensions?",
          highlightTerm: "section view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "When would you use a full section view versus a half section view?",
          highlightTerm: "section view",
        },
      ],
      collocations: [
        { text: "full section view", type: "common" },
        { text: "half section view", type: "common" },
        { text: "cross-hatching (gạch chéo)", type: "related" },
        { text: "cutting plane line", type: "related" },
        { text: "section A-A", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ A-A reveals the internal bore diameter and wall thickness.",
          options: [
            "section view",
            "detail view",
            "front view",
            "isometric view",
          ],
          correctAnswer: "section view",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What is the purpose of a section view?",
          options: [
            "To show the part from above",
            "To reveal internal features by cutting along a plane",
            "To enlarge a small area of the drawing",
            "To show the part in 3D",
          ],
          correctAnswer:
            "To reveal internal features by cutting along a plane",
        },
      ],
    },
    {
      id: "w003",
      term: "title block",
      ipa: "/ˈtaɪ.tl̩ blɒk/",
      pronunciationHint: "TAI-tồ blóc",
      partOfSpeech: "noun",
      definitionEn:
        "A bordered area on a drawing sheet containing essential information: part name, number, material, scale, revision, drafter, and approval signatures.",
      definitionVi:
        "Khung tên — vùng có viền trên bản vẽ chứa thông tin: tên chi tiết, mã số, vật liệu, tỷ lệ, phiên bản, người vẽ và chữ ký duyệt.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "Always check the title block for the latest revision number before manufacturing.",
          highlightTerm: "title block",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The title block shows revision C, but the supplier is working from revision A. Please send the latest version.",
          highlightTerm: "title block",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What key information would you look for in a title block?",
          highlightTerm: "title block",
        },
      ],
      collocations: [
        { text: "revision block", type: "related" },
        { text: "drawing number", type: "common" },
        { text: "revision history", type: "related" },
        { text: "bill of materials (BOM)", type: "related" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "Always check the _____ for the latest revision number before manufacturing.",
          options: ["title block", "section view", "border line", "notes area"],
          correctAnswer: "title block",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "Which best describes a title block?",
          options: [
            "A 3D model of the part",
            "A bordered area with part name, number, material, scale, and revision",
            "A list of all dimensions",
            "A type of projection method",
          ],
          correctAnswer:
            "A bordered area with part name, number, material, scale, and revision",
        },
      ],
    },
    {
      id: "w004",
      term: "scale",
      ipa: "/skeɪl/",
      pronunciationHint: "skây-ồ",
      partOfSpeech: "noun",
      definitionEn:
        "The ratio between the size of the drawing and the actual size of the object. Common scales: 1:1 (full), 2:1 (enlarged), 1:2 (reduced).",
      definitionVi:
        "Tỷ lệ — tỉ số giữa kích thước trên bản vẽ và kích thước thực. Các tỷ lệ phổ biến: 1:1 (nguyên), 2:1 (phóng to), 1:2 (thu nhỏ).",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "This detail view is drawn at a scale of 5:1 to show the thread profile clearly.",
          highlightTerm: "scale",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Please note the drawing scale is 1:2, so do not measure directly from the print.",
          highlightTerm: "scale",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "Why is it important to check the scale before reading dimensions from a drawing?",
          highlightTerm: "scale",
        },
      ],
      collocations: [
        { text: "drawn to scale", type: "common" },
        { text: "not to scale (NTS)", type: "common" },
        { text: "full scale (1:1)", type: "common" },
        {
          text: "Dễ nhầm: scale (tỷ lệ) ≠ scale (vảy/cân)",
          type: "confused",
        },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "This detail view is drawn at a _____ of 5:1 to show the thread profile clearly.",
          options: ["scale", "tolerance", "dimension", "projection"],
          correctAnswer: "scale",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What does a scale of 2:1 mean on a drawing?",
          options: [
            "The drawing is half the actual size",
            "The drawing is twice the actual size",
            "The drawing uses two views",
            "The part has two revisions",
          ],
          correctAnswer: "The drawing is twice the actual size",
        },
      ],
    },
    {
      id: "w005",
      term: "detail view",
      ipa: "/ˈdiː.teɪl vjuː/",
      pronunciationHint: "ĐI-tây-ồ viu",
      partOfSpeech: "noun",
      definitionEn:
        "An enlarged view of a specific area of a drawing, used to show small features that are hard to see at the main scale.",
      definitionVi:
        "Hình chiếu chi tiết — hình phóng to một vùng nhỏ trên bản vẽ để thể hiện rõ các đặc điểm nhỏ khó nhìn ở tỷ lệ chính.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "See detail view B at 10:1 for the chamfer and fillet dimensions.",
          highlightTerm: "detail view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "I've added a detail view of the O-ring groove area for your reference.",
          highlightTerm: "detail view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "When would you use a detail view instead of a section view?",
          highlightTerm: "detail view",
        },
      ],
      collocations: [
        { text: "detail B (circle with letter)", type: "common" },
        { text: "enlarged view", type: "related" },
        {
          text: "Dễ nhầm: detail view ≠ detailed drawing (bản vẽ chi tiết)",
          type: "confused",
        },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "See _____ B at 10:1 for the chamfer and fillet dimensions.",
          options: [
            "detail view",
            "section view",
            "front view",
            "auxiliary view",
          ],
          correctAnswer: "detail view",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What is a detail view used for?",
          options: [
            "To show the part from multiple angles",
            "To enlarge a small area that is hard to see at main scale",
            "To show internal features of a part",
            "To display the bill of materials",
          ],
          correctAnswer:
            "To enlarge a small area that is hard to see at main scale",
        },
      ],
    },
    {
      id: "w006",
      term: "hidden line",
      ipa: "/ˈhɪd.ən laɪn/",
      pronunciationHint: "HÍT-đần lai-n",
      partOfSpeech: "noun",
      definitionEn:
        "A dashed line on a drawing representing edges or surfaces that are not visible from the current viewing angle.",
      definitionVi:
        "Nét khuất — nét đứt trên bản vẽ biểu diễn các cạnh hoặc bề mặt không nhìn thấy từ hướng nhìn hiện tại.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "Hidden lines are shown as dashed lines to indicate features behind the visible surface.",
          highlightTerm: "Hidden lines",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The hidden lines in the front view show the position of the internal bore.",
          highlightTerm: "hidden lines",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "When can you omit hidden lines from a drawing to improve clarity?",
          highlightTerm: "hidden lines",
        },
      ],
      collocations: [
        { text: "dashed line", type: "related" },
        { text: "visible line (nét thấy)", type: "related" },
        { text: "hidden edge", type: "common" },
        {
          text: "Dễ nhầm: hidden line ≠ phantom line (nét tưởng tượng)",
          type: "confused",
        },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "_____ are shown as dashed lines to indicate features behind the visible surface.",
          options: [
            "Hidden lines",
            "Center lines",
            "Cutting plane lines",
            "Leader lines",
          ],
          correctAnswer: "Hidden lines",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "How are hidden lines typically drawn?",
          options: [
            "As solid thick lines",
            "As dashed lines",
            "As chain lines (dash-dot)",
            "As wavy lines",
          ],
          correctAnswer: "As dashed lines",
        },
      ],
    },
    {
      id: "w007",
      term: "center line",
      ipa: "/ˈsen.tər laɪn/",
      pronunciationHint: "SEN-tờ lai-n",
      partOfSpeech: "noun",
      definitionEn:
        "A thin chain line (alternating long and short dashes) indicating the axis of symmetry of a feature, such as a hole or cylindrical part.",
      definitionVi:
        "Đường tâm — nét chấm gạch mảnh chỉ trục đối xứng của đặc điểm hình học, như lỗ hoặc chi tiết trụ.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The center line indicates the axis of the bore and should extend slightly beyond the feature.",
          highlightTerm: "center line",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Please add center lines to all holes on the top view for dimensioning.",
          highlightTerm: "center lines",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What is the difference between a center line and a line of symmetry?",
          highlightTerm: "center line",
        },
      ],
      collocations: [
        { text: "axis of symmetry", type: "related" },
        { text: "bolt circle center line", type: "common" },
        { text: "chain line (nét chấm gạch)", type: "related" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ indicates the axis of the bore and should extend slightly beyond the feature.",
          options: [
            "center line",
            "hidden line",
            "dimension line",
            "cutting plane line",
          ],
          correctAnswer: "center line",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What does a center line indicate on a drawing?",
          options: [
            "The edge of the part",
            "The axis of symmetry of a feature",
            "A hidden surface",
            "The cutting plane location",
          ],
          correctAnswer: "The axis of symmetry of a feature",
        },
      ],
    },
    {
      id: "w008",
      term: "dimension line",
      ipa: "/dɪˈmen.ʃən laɪn/",
      pronunciationHint: "đi-MEN-shần lai-n",
      partOfSpeech: "noun",
      definitionEn:
        "A thin line with arrowheads at both ends, placed between extension lines, showing the measurement of a feature.",
      definitionVi:
        "Đường kích thước — nét mảnh có mũi tên hai đầu, nằm giữa hai đường gióng, thể hiện kích thước đo của đặc điểm.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The dimension line should be placed at least 10 mm from the object outline.",
          highlightTerm: "dimension line",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Some dimension lines are overlapping — could you rearrange them for clarity?",
          highlightTerm: "dimension lines",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What are the rules for placing dimension lines on a drawing?",
          highlightTerm: "dimension lines",
        },
      ],
      collocations: [
        { text: "extension line (đường gióng)", type: "related" },
        { text: "arrowhead", type: "common" },
        { text: "dimension text", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ should be placed at least 10 mm from the object outline.",
          options: [
            "dimension line",
            "center line",
            "hidden line",
            "border line",
          ],
          correctAnswer: "dimension line",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What is at both ends of a dimension line?",
          options: [
            "Circles",
            "Arrowheads",
            "Dots",
            "Squares",
          ],
          correctAnswer: "Arrowheads",
        },
      ],
    },
    {
      id: "w009",
      term: "leader line",
      ipa: "/ˈliː.dər laɪn/",
      pronunciationHint: "LI-đờ lai-n",
      partOfSpeech: "noun",
      definitionEn:
        "A thin line with an arrowhead at one end, used to connect a note or dimension to the feature it refers to.",
      definitionVi:
        "Đường dẫn — nét mảnh có mũi tên ở một đầu, dùng để nối ghi chú hoặc kích thước đến đặc điểm mà nó chỉ đến.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "A leader line points from the surface finish symbol to the machined surface.",
          highlightTerm: "leader line",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The leader line for the note is pointing to the wrong surface. Please correct it.",
          highlightTerm: "leader line",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "How does a leader line differ from a dimension line?",
          highlightTerm: "leader line",
        },
      ],
      collocations: [
        { text: "note callout", type: "related" },
        { text: "surface finish symbol", type: "related" },
        { text: "arrowhead / dot terminator", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "A _____ points from the surface finish symbol to the machined surface.",
          options: [
            "leader line",
            "dimension line",
            "center line",
            "phantom line",
          ],
          correctAnswer: "leader line",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What is a leader line used for?",
          options: [
            "To show hidden features",
            "To connect a note or symbol to a feature",
            "To indicate the center axis",
            "To show the cutting plane",
          ],
          correctAnswer: "To connect a note or symbol to a feature",
        },
      ],
    },
    {
      id: "w010",
      term: "cutting plane line",
      ipa: "/ˈkʌt.ɪŋ pleɪn laɪn/",
      pronunciationHint: "CÁT-ting plây-n lai-n",
      partOfSpeech: "noun",
      definitionEn:
        "A thick chain line (long dash–short dash) with arrows at the ends showing the direction of view, indicating where an imaginary cut is made for a section view.",
      definitionVi:
        "Đường mặt cắt — nét chấm gạch đậm có mũi tên ở hai đầu chỉ hướng nhìn, cho biết vị trí cắt tưởng tượng để tạo hình cắt.",
      difficulty: 2,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The cutting plane line A-A shows where the part is sliced to create section view A-A.",
          highlightTerm: "cutting plane line",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Could you move the cutting plane line to pass through the center of the bore?",
          highlightTerm: "cutting plane line",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What do the arrows on a cutting plane line indicate?",
          highlightTerm: "cutting plane line",
        },
      ],
      collocations: [
        { text: "section A-A", type: "common" },
        { text: "direction of view", type: "related" },
        { text: "offset cutting plane", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ A-A shows where the part is sliced to create section view A-A.",
          options: [
            "cutting plane line",
            "center line",
            "hidden line",
            "phantom line",
          ],
          correctAnswer: "cutting plane line",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What do the arrows on a cutting plane line show?",
          options: [
            "The dimension of the cut",
            "The direction of viewing for the section",
            "The material type",
            "The tolerance zone",
          ],
          correctAnswer: "The direction of viewing for the section",
        },
      ],
    },
    {
      id: "w011",
      term: "front view",
      ipa: "/frʌnt vjuː/",
      pronunciationHint: "phơ-RÂN-T viu",
      partOfSpeech: "noun",
      definitionEn:
        "The principal view of an object showing its most characteristic shape, typically the view seen when looking straight at the front of the object.",
      definitionVi:
        "Hình chiếu đứng — hình chiếu chính thể hiện hình dạng đặc trưng nhất, thường là hướng nhìn thẳng vào mặt trước vật thể.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The front view should be chosen to show the most features with the fewest hidden lines.",
          highlightTerm: "front view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The front view in the drawing doesn't match the 3D model orientation — please verify.",
          highlightTerm: "front view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "How do you decide which view should be the front view?",
          highlightTerm: "front view",
        },
      ],
      collocations: [
        { text: "principal view", type: "related" },
        { text: "elevation view", type: "related" },
        { text: "front elevation", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ should be chosen to show the most features with the fewest hidden lines.",
          options: ["front view", "top view", "side view", "section view"],
          correctAnswer: "front view",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "How should you choose the front view?",
          options: [
            "Always from the left side",
            "The view showing the most characteristic shape",
            "Always the smallest view",
            "The view with the most hidden lines",
          ],
          correctAnswer: "The view showing the most characteristic shape",
        },
      ],
    },
    {
      id: "w012",
      term: "top view",
      ipa: "/tɒp vjuː/",
      pronunciationHint: "tóp viu",
      partOfSpeech: "noun",
      definitionEn:
        "The view of an object as seen from directly above, also called the plan view. In third-angle projection, it is placed above the front view.",
      definitionVi:
        "Hình chiếu bằng — hướng nhìn từ trên xuống vật thể. Trong chiếu góc thứ 3, nó được đặt phía trên hình chiếu đứng.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The bolt hole pattern is best shown in the top view.",
          highlightTerm: "top view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Could you add the mounting hole locations to the top view?",
          highlightTerm: "top view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "In third-angle projection, where is the top view placed relative to the front view?",
          highlightTerm: "top view",
        },
      ],
      collocations: [
        { text: "plan view", type: "related" },
        { text: "third-angle projection", type: "related" },
        { text: "top elevation", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question: "The bolt hole pattern is best shown in the _____.",
          options: ["top view", "front view", "section view", "detail view"],
          correctAnswer: "top view",
          contextType: "standard",
        },
        {
          type: "explain",
          question:
            "Where is the top view placed in third-angle projection?",
          options: [
            "Below the front view",
            "Above the front view",
            "To the right of the front view",
            "On a separate sheet",
          ],
          correctAnswer: "Above the front view",
        },
      ],
    },
    {
      id: "w013",
      term: "isometric view",
      ipa: "/ˌaɪ.səˈmet.rɪk vjuː/",
      pronunciationHint: "ai-sờ-MÉT-rích viu",
      partOfSpeech: "noun",
      definitionEn:
        "A 3D pictorial view where the three axes are equally inclined at 120° to each other, giving a realistic appearance without perspective distortion.",
      definitionVi:
        "Hình chiếu trục đo — hình chiếu 3D trong đó ba trục nghiêng đều nhau 120°, cho hình ảnh trực quan mà không bị biến dạng phối cảnh.",
      difficulty: 2,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "An isometric view is often included to help the reader visualize the part quickly.",
          highlightTerm: "isometric view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Please add an isometric view to the drawing for the assembly team's reference.",
          highlightTerm: "isometric view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What is the difference between an isometric view and an orthographic projection?",
          highlightTerm: "isometric view",
        },
      ],
      collocations: [
        { text: "isometric drawing", type: "common" },
        { text: "pictorial view", type: "related" },
        { text: "30° axes", type: "common" },
        {
          text: "Dễ nhầm: isometric ≠ perspective (có điểm tụ)",
          type: "confused",
        },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "An _____ is often included to help the reader visualize the part quickly.",
          options: [
            "isometric view",
            "section view",
            "hidden view",
            "auxiliary view",
          ],
          correctAnswer: "isometric view",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What angle are the axes in an isometric view?",
          options: [
            "90° to each other",
            "120° to each other",
            "45° to each other",
            "60° to each other",
          ],
          correctAnswer: "120° to each other",
        },
      ],
    },
    {
      id: "w014",
      term: "auxiliary view",
      ipa: "/ɔːɡˈzɪl.jə.ri vjuː/",
      pronunciationHint: "óc-ZÍL-yờ-ri viu",
      partOfSpeech: "noun",
      definitionEn:
        "A view projected onto a plane that is not one of the six principal planes, used to show the true shape of an inclined surface.",
      definitionVi:
        "Hình chiếu phụ — hình chiếu trên mặt phẳng không phải 6 mặt phẳng chính, dùng thể hiện hình dạng thực của mặt nghiêng.",
      difficulty: 2,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "An auxiliary view is needed to show the true shape of the angled flange.",
          highlightTerm: "auxiliary view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The inclined surface appears foreshortened in all principal views — please add an auxiliary view.",
          highlightTerm: "auxiliary view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence: "When is an auxiliary view necessary on a drawing?",
          highlightTerm: "auxiliary view",
        },
      ],
      collocations: [
        { text: "true shape", type: "related" },
        { text: "inclined surface", type: "common" },
        { text: "primary auxiliary view", type: "common" },
        { text: "foreshortened (bị rút ngắn)", type: "related" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "An _____ is needed to show the true shape of the angled flange.",
          options: [
            "auxiliary view",
            "front view",
            "section view",
            "detail view",
          ],
          correctAnswer: "auxiliary view",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "Why is an auxiliary view used?",
          options: [
            "To enlarge a small feature",
            "To show the true shape of an inclined surface",
            "To reveal internal features",
            "To add a 3D appearance",
          ],
          correctAnswer: "To show the true shape of an inclined surface",
        },
      ],
    },
    {
      id: "w015",
      term: "exploded view",
      ipa: "/ɪkˈsploʊ.dɪd vjuː/",
      pronunciationHint: "ích-XPLÂU-địt viu",
      partOfSpeech: "noun",
      definitionEn:
        "A pictorial drawing showing the components of an assembly separated along an axis, indicating how parts fit together.",
      definitionVi:
        "Hình chiếu phân rã — hình vẽ thể hiện các chi tiết trong cụm lắp ráp tách rời nhau dọc theo trục, cho thấy cách lắp ghép.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The exploded view shows the order of assembly for the gearbox components.",
          highlightTerm: "exploded view",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Could you create an exploded view of the valve assembly for the maintenance manual?",
          highlightTerm: "exploded view",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence: "What information does an exploded view convey?",
          highlightTerm: "exploded view",
        },
      ],
      collocations: [
        { text: "assembly drawing", type: "related" },
        { text: "parts list", type: "related" },
        { text: "balloon numbers (số bóng)", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ shows the order of assembly for the gearbox components.",
          options: [
            "exploded view",
            "section view",
            "front view",
            "detail view",
          ],
          correctAnswer: "exploded view",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What does an exploded view show?",
          options: [
            "The internal cross-section of a part",
            "Components separated to show how they fit together",
            "The part at a larger scale",
            "Hidden edges of a part",
          ],
          correctAnswer:
            "Components separated to show how they fit together",
        },
      ],
    },
    {
      id: "w016",
      term: "bill of materials",
      ipa: "/bɪl əv məˈtɪr.i.əlz/",
      pronunciationHint: "bil ov mờ-TIA-ri-ồz",
      partOfSpeech: "noun",
      definitionEn:
        "A tabular list on a drawing or separate document that itemizes all parts, materials, quantities, and part numbers needed for an assembly. Abbreviated as BOM.",
      definitionVi:
        "Bảng kê vật tư (BOM) — danh sách dạng bảng liệt kê tất cả chi tiết, vật liệu, số lượng và mã số cần cho cụm lắp ráp.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The bill of materials lists all components required for the pump assembly.",
          highlightTerm: "bill of materials",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "Please update the BOM — the gasket material has been changed from rubber to PTFE.",
          highlightTerm: "BOM",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What information is typically included in a bill of materials?",
          highlightTerm: "bill of materials",
        },
      ],
      collocations: [
        { text: "BOM (abbreviation)", type: "common" },
        { text: "parts list", type: "related" },
        { text: "item number", type: "common" },
        { text: "BOM revision", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ lists all components required for the pump assembly.",
          options: [
            "bill of materials",
            "title block",
            "revision history",
            "tolerance table",
          ],
          correctAnswer: "bill of materials",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What does BOM stand for?",
          options: [
            "Base of Measurement",
            "Bill of Materials",
            "Block of Modules",
            "Bore of Metal",
          ],
          correctAnswer: "Bill of Materials",
        },
      ],
    },
    {
      id: "w017",
      term: "revision",
      ipa: "/rɪˈvɪʒ.ən/",
      pronunciationHint: "ri-VÍ-zhần",
      partOfSpeech: "noun",
      definitionEn:
        "A documented change to a drawing. Each revision is assigned a letter (A, B, C…) and recorded in the revision block with the date, description, and approver.",
      definitionVi:
        "Phiên bản sửa đổi — thay đổi được ghi nhận trên bản vẽ. Mỗi lần sửa được gán ký hiệu (A, B, C…) và ghi trong khung sửa đổi kèm ngày, mô tả, người duyệt.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "Always manufacture to the latest revision of the drawing.",
          highlightTerm: "revision",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "We are now at revision D — please discard all prints of revision C.",
          highlightTerm: "revision",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "Why is revision control important in engineering drawings?",
          highlightTerm: "revision",
        },
      ],
      collocations: [
        { text: "revision block", type: "common" },
        { text: "revision history", type: "common" },
        { text: "ECN (Engineering Change Notice)", type: "related" },
        { text: "latest revision", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "Always manufacture to the latest _____ of the drawing.",
          options: ["revision", "scale", "section", "projection"],
          correctAnswer: "revision",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "How are drawing revisions typically identified?",
          options: [
            "By color coding",
            "By sequential letters (A, B, C…)",
            "By the number of views",
            "By the drawing size",
          ],
          correctAnswer: "By sequential letters (A, B, C…)",
        },
      ],
    },
    {
      id: "w018",
      term: "chamfer",
      ipa: "/ˈtʃæm.fər/",
      pronunciationHint: "CHEM-phờ",
      partOfSpeech: "noun",
      definitionEn:
        "A beveled edge or cut at a corner of a part, typically at 45°, used to ease assembly and remove sharp edges. Noted as C × dimension (e.g., C1, meaning 1 × 45°).",
      definitionVi:
        "Vát mép — cạnh vát ở góc chi tiết, thường 45°, dùng để dễ lắp ráp và loại bỏ cạnh sắc. Ký hiệu C × kích thước (ví dụ: C1 nghĩa là 1 × 45°).",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "Apply a 1 × 45° chamfer to all external edges unless otherwise specified.",
          highlightTerm: "chamfer",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The chamfer on the shaft end is too large — it should be 0.5 × 45°, not 1 × 45°.",
          highlightTerm: "chamfer",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What is the difference between a chamfer and a fillet?",
          highlightTerm: "chamfer",
        },
      ],
      collocations: [
        { text: "45° chamfer", type: "common" },
        { text: "chamfer dimension", type: "common" },
        {
          text: "Dễ nhầm: chamfer (vát phẳng) ≠ fillet (bo tròn)",
          type: "confused",
        },
        { text: "break edges", type: "related" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "Apply a 1 × 45° _____ to all external edges unless otherwise specified.",
          options: ["chamfer", "fillet", "radius", "groove"],
          correctAnswer: "chamfer",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What is a chamfer?",
          options: [
            "A rounded internal corner",
            "A beveled edge typically at 45°",
            "A type of thread",
            "A surface finish specification",
          ],
          correctAnswer: "A beveled edge typically at 45°",
        },
      ],
    },
    {
      id: "w019",
      term: "fillet",
      ipa: "/ˈfɪl.ɪt/",
      pronunciationHint: "PHÍL-lịt",
      partOfSpeech: "noun",
      definitionEn:
        "A rounded interior corner or edge on a part, used to reduce stress concentration and improve strength at junctions.",
      definitionVi:
        "Bo tròn — góc trong được làm tròn trên chi tiết, giúp giảm tập trung ứng suất và tăng bền tại các chỗ nối.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "A fillet radius of R3 is applied to reduce stress at the step of the shaft.",
          highlightTerm: "fillet",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The fillet at the base of the flange is missing from the drawing — please add R2.",
          highlightTerm: "fillet",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "Why are fillets important in mechanical design?",
          highlightTerm: "fillets",
        },
      ],
      collocations: [
        { text: "fillet radius", type: "common" },
        { text: "stress concentration", type: "related" },
        {
          text: "Dễ nhầm: fillet (bo tròn) ≠ chamfer (vát phẳng)",
          type: "confused",
        },
        { text: "fillet weld", type: "related" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "A _____ radius of R3 is applied to reduce stress at the step of the shaft.",
          options: ["fillet", "chamfer", "groove", "bore"],
          correctAnswer: "fillet",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "Why are fillets used in mechanical design?",
          options: [
            "To make the part look better",
            "To reduce stress concentration at corners",
            "To increase the weight of the part",
            "To create sharp edges",
          ],
          correctAnswer: "To reduce stress concentration at corners",
        },
      ],
    },
    {
      id: "w020",
      term: "cross-hatching",
      ipa: "/ˈkrɒs.hætʃ.ɪŋ/",
      pronunciationHint: "CRÓT-hách-ing",
      partOfSpeech: "noun",
      definitionEn:
        "Diagonal parallel lines drawn on the cut surface of a section view to indicate solid material. Different hatch patterns can represent different materials.",
      definitionVi:
        "Gạch chéo mặt cắt — các đường song song vẽ chéo trên bề mặt cắt trong hình cắt để chỉ vật liệu đặc. Các mẫu gạch khác nhau biểu thị vật liệu khác nhau.",
      difficulty: 1,
      contexts: [
        {
          scenarioType: "standard",
          scenarioIcon: "📖",
          sentence:
            "The cross-hatching pattern at 45° indicates the part is made of general-purpose metal.",
          highlightTerm: "cross-hatching",
        },
        {
          scenarioType: "email",
          scenarioIcon: "📧",
          sentence:
            "The cross-hatching is missing on section B-B — please add it so the cut area is clear.",
          highlightTerm: "cross-hatching",
        },
        {
          scenarioType: "interview",
          scenarioIcon: "🎤",
          sentence:
            "What do different cross-hatching patterns represent on a drawing?",
          highlightTerm: "cross-hatching",
        },
      ],
      collocations: [
        { text: "hatch pattern", type: "common" },
        { text: "section lining", type: "related" },
        { text: "material indication", type: "related" },
        { text: "45° hatch lines", type: "common" },
      ],
      practiceQuestions: [
        {
          type: "fill_in",
          question:
            "The _____ pattern at 45° indicates the part is made of general-purpose metal.",
          options: [
            "cross-hatching",
            "center line",
            "dimension line",
            "hidden line",
          ],
          correctAnswer: "cross-hatching",
          contextType: "standard",
        },
        {
          type: "explain",
          question: "What is the purpose of cross-hatching in a section view?",
          options: [
            "To show dimensions",
            "To indicate solid material on the cut surface",
            "To mark the center axis",
            "To highlight the title block",
          ],
          correctAnswer:
            "To indicate solid material on the cut surface",
        },
      ],
    },
  ],
};
